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

    /**
     * Busca o detalhamento das linguagens utilizadas em um repositório.
     *
     * @param string $username
     * @param string $repo
     * @return array Mapa de linguagens (nome => bytes de código)
     * @throws \Exception
     */
    public function fetchRepositoryLanguages(string $username, string $repo): array;
}
