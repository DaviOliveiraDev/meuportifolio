<?php

namespace App\Application\DTOs\Auth;

use Illuminate\Http\Request;

class RegisterDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly string $name,
        public readonly string $username
    ) {}

    /**
     * Instancia o DTO a partir de um objeto Request do Laravel.
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            email: $request->input('email'),
            password: $request->input('password'),
            name: $request->input('name'),
            username: $request->input('username')
        );
    }

    /**
     * Converte o DTO para array adequado para inserção/validação.
     */
    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
            'name' => $this->name,
            'username' => $this->username,
        ];
    }
}
