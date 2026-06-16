<?php

namespace App\Infrastructure\Services\Github;

use App\Domain\Services\GithubServiceInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GithubService implements GithubServiceInterface
{
    /**
     * Busca os repositórios públicos de um determinado usuário do GitHub.
     */
    public function fetchUserRepositories(string $username): array
    {
        Log::info("Iniciando busca de repositórios do GitHub para o usuário: {$username}");

        $request = Http::withHeaders([
            'Accept' => 'application/vnd.github.v3+json',
            'User-Agent' => 'DevFolio-App',
        ]);

        if (app()->environment('local', 'testing')) {
            $request = $request->withoutVerifying();
        }

        $response = $request->timeout(15)->get("https://api.github.com/users/{$username}/repos", [
            'per_page' => 100,
            'type' => 'owner',
            'sort' => 'updated'
        ]);

        if ($response->failed()) {
            $status = $response->status();
            $body = $response->body();
            Log::error("Erro ao consultar a API do GitHub para o usuário {$username}. Status: {$status}, Body: {$body}");
            
            if ($status === 404) {
                throw new Exception("Usuário do GitHub '{$username}' não encontrado.");
            }
            
            throw new Exception("Falha ao se comunicar com o GitHub API (Código: {$status}).");
        }

        $repositories = $response->json();

        if (!is_array($repositories)) {
            Log::error("Retorno inválido da API do GitHub para o usuário {$username}.");
            throw new Exception("Resposta inválida do GitHub.");
        }

        Log::info("Encontrados " . count($repositories) . " repositórios públicos para o usuário: {$username}");

        return $repositories;
    }

    /**
     * Busca as linguagens utilizadas em um repositório específico.
     */
    public function fetchRepositoryLanguages(string $username, string $repo): array
    {
        Log::info("GithubService: Buscando linguagens do repositório {$username}/{$repo}");

        $request = Http::withHeaders([
            'Accept' => 'application/vnd.github.v3+json',
            'User-Agent' => 'DevFolio-App',
        ]);

        if (app()->environment('local', 'testing')) {
            $request = $request->withoutVerifying();
        }

        $response = $request->timeout(10)->get("https://api.github.com/repos/{$username}/{$repo}/languages");

        if ($response->failed()) {
            Log::warning("GithubService: Falha ao buscar linguagens para {$username}/{$repo}. Status: {$response->status()}");
            return [];
        }

        $languages = $response->json();

        return is_array($languages) ? $languages : [];
    }
}
