<?php

namespace App\Domain\Services;

interface GithubServiceInterface
{
    /**
     * Busca os repositórios públicos de um determinado usuário do GitHub.
     *
     * @param string $username
     * @return array Array de repositórios estruturado
     * @throws \Exception
     */
    public function fetchUserRepositories(string $username): array;
}
