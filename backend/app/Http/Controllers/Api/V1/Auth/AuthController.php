<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Application\Actions\Auth\RegisterUserAction;
use App\Application\DTOs\Auth\RegisterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Infrastructure\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Realiza o registro de um novo usuário.
     */
    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $dto = RegisterDTO::fromRequest($request);
        
        $user = $action->execute($dto);
        
        // Gera o token de API do Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'message' => 'Usuário cadastrado e autenticado com sucesso.',
            'token' => $token,
            'user' => $user->load(['profile.skills', 'profile.badges']),
        ], 201);
    }

    /**
     * Realiza a autenticação de um usuário existente.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();
        
        if (!$user || !\Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        // Gera o token de API do Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'token' => $token,
            'user' => $user->load(['profile.skills', 'profile.badges']),
        ]);
    }

    /**
     * Encerra a sessão do usuário.
     */
    public function logout(Request $request): JsonResponse
    {
        // Deleta o token de acesso atual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }

    /**
     * Retorna os dados do usuário autenticado atual.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['profile.skills', 'profile.badges']);
        
        if ($user->profile && $user->profile->skills->count() >= 3) {
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($user->profile, 'add_skills');
            // Reload to get updated XP/level
            $user->load(['profile.skills', 'profile.badges']);
        }
        
        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Retorna a URL de redirecionamento para o Provedor OAuth (GitHub/Google).
     */
    public function redirectToProvider(string $provider): JsonResponse
    {
        if (!in_array($provider, ['github', 'google'])) {
            return response()->json(['message' => 'Provedor não suportado.'], 400);
        }

        $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();

        return response()->json([
            'url' => $url
        ]);
    }

    /**
     * Lida com o callback do provedor social, criando/vinculando conta e iniciando sessão.
     */
    public function handleProviderCallback(Request $request, string $provider)
    {
        $frontendUrl = env('FRONTEND_URL', 'https://devfolio.app.br');

        if (!in_array($provider, ['github', 'google'])) {
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('Provedor não suportado.'));
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('Não foi possível recuperar os dados de autenticação do provedor.'));
        }

        if (!$socialUser->getEmail()) {
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('O provedor social não retornou um endereço de e-mail válido.'));
        }

        $user = DB::transaction(function () use ($socialUser, $provider) {
            $existingUser = User::where('email', $socialUser->getEmail())->first();

            if ($existingUser) {
                // Vincula o provedor se ainda não estiver vinculado
                $existingUser->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                ]);

                if (!$existingUser->profile) {
                    $existingUser->profile()->create([
                        'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Desenvolvedor',
                        'username' => strtolower($socialUser->getNickname() ?? uniqid('user_')),
                        'avatar_url' => $socialUser->getAvatar(),
                        'github_url' => $provider === 'github' ? 'https://github.com/' . $socialUser->getNickname() : null,
                        'theme_name' => 'minimalist',
                    ]);
                }

                return $existingUser;
            }

            // Cria novo usuário e perfil do zero
            $newUser = User::create([
                'email' => $socialUser->getEmail(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
            ]);

            $newUser->profile()->create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Desenvolvedor',
                'username' => strtolower($socialUser->getNickname() ?? uniqid('user_')),
                'avatar_url' => $socialUser->getAvatar(),
                'github_url' => $provider === 'github' ? 'https://github.com/' . $socialUser->getNickname() : null,
                'theme_name' => 'minimalist',
            ]);

            return $newUser;
        });

        // Gera o token de API do Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return redirect()->away($frontendUrl . '/login?token=' . $token);
    }
}
