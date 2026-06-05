<?php

namespace App\Application\Actions\Auth;

use App\Application\DTOs\Auth\RegisterDTO;
use App\Domain\Repositories\UserRepositoryInterface;
use App\Infrastructure\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    /**
     * Executa a criação de um usuário e de seu respectivo perfil transacionalmente.
     *
     * @param RegisterDTO $dto
     * @return User
     * @throws \Exception
     */
    public function execute(RegisterDTO $dto): User
    {
        return DB::transaction(function () use ($dto) {
            // 1. Criação do Usuário
            $user = $this->userRepository->create([
                'email' => $dto->email,
                'password' => Hash::make($dto->password),
            ]);

            // 2. Criação do Perfil Profissional inicial associado
            $user->profile()->create([
                'name' => $dto->name,
                'username' => strtolower($dto->username),
                'theme_name' => 'minimalist', // tema inicial padrão do MVP
            ]);

            return $user;
        });
    }
}
