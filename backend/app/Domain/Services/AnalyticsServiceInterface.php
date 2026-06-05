<?php

namespace App\Domain\Services;

interface AnalyticsServiceInterface
{
    /**
     * Rastreia um evento de acesso ou clique associado a um perfil.
     *
     * @param string $profileId
     * @param string $eventType (view_profile, view_project, click_link)
     * @param string|null $targetId (ID do projeto ou link se aplicável)
     * @param string $ip (IP do visitante para hash/LGPD)
     * @param string|null $userAgent
     * @param string|null $referer
     * @return void
     */
    public function trackEvent(
        string $profileId,
        string $eventType,
        ?string $targetId,
        string $ip,
        ?string $userAgent,
        ?string $referer
    ): void;

    /**
     * Descarrega todos os eventos acumulados no Redis para a tabela PostgreSQL.
     *
     * @return int Quantidade de registros gravados com sucesso
     */
    public function flushEventsToDatabase(): int;
}
