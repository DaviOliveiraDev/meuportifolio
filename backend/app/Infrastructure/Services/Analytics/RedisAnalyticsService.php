<?php

namespace App\Infrastructure\Services\Analytics;

use App\Domain\Services\AnalyticsServiceInterface;
use App\Infrastructure\Models\AnalyticsEvent;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class RedisAnalyticsService implements AnalyticsServiceInterface
{
    private const REDIS_BUFFER_KEY = 'devfolio_analytics_events_buffer';

    /**
     * Rastreia um evento de acesso ou clique associado a um perfil com controle anti-spam.
     */
    public function trackEvent(
        string $profileId,
        string $eventType,
        ?string $targetId,
        string $ip,
        ?string $userAgent,
        ?string $referer
    ): void {
        $ipHash = hash('sha256', $ip);

        // Chave única para evitar dupla contagem do mesmo visitante no período de 1 hora
        $uniqueKey = "analytics_uniq:{$profileId}:{$eventType}:" . ($targetId ?? 'null') . ":{$ipHash}";

        if (Cache::has($uniqueKey)) {
            // Acesso repetido recente, ignorado para evitar inflar as métricas
            return;
        }

        // Define a trava de 1 hora
        Cache::put($uniqueKey, true, now()->addHour());

        $eventPayload = [
            'profile_id' => $profileId,
            'event_type' => $eventType,
            'target_id' => $targetId,
            'viewer_ip_hash' => $ipHash,
            'user_agent' => $userAgent ? mb_substr($userAgent, 0, 500) : null,
            'referer' => $referer ? mb_substr($referer, 0, 255) : null,
            'created_at' => now()->toIso8601String(),
        ];

        // Adiciona à fila de buffer no Redis
        Redis::rpush(self::REDIS_BUFFER_KEY, json_encode($eventPayload));
    }

    /**
     * Descarrega os eventos do Redis para o banco PostgreSQL em lotes.
     */
    public function flushEventsToDatabase(): int
    {
        $totalFlushed = 0;

        do {
            $events = [];

            // Pop de até 1000 itens por lote
            for ($i = 0; $i < 1000; $i++) {
                $eventJson = Redis::lpop(self::REDIS_BUFFER_KEY);
                if (!$eventJson) {
                    break;
                }

                $eventData = json_decode($eventJson, true);
                if ($eventData) {
                    $events[] = [
                        'id' => (string) Str::uuid(),
                        'profile_id' => $eventData['profile_id'],
                        'event_type' => $eventData['event_type'],
                        'target_id' => $eventData['target_id'],
                        'viewer_ip_hash' => $eventData['viewer_ip_hash'],
                        'user_agent' => $eventData['user_agent'],
                        'referer' => $eventData['referer'],
                        'created_at' => $eventData['created_at'],
                    ];
                }
            }

            if (count($events) > 0) {
                AnalyticsEvent::insert($events);
                $totalFlushed += count($events);
            }

        } while (count($events) === 1000);

        if ($totalFlushed > 0) {
            Log::info("Métricas de Analytics descarregadas do Redis para o banco PostgreSQL: {$totalFlushed} registros.");
        }

        return $totalFlushed;
    }
}
