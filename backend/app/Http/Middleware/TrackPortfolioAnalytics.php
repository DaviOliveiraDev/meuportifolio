<?php

namespace App\Http\Middleware;

use App\Domain\Services\AnalyticsServiceInterface;
use App\Infrastructure\Models\Profile;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPortfolioAnalytics
{
    public function __construct(protected AnalyticsServiceInterface $analyticsService)
    {
    }

    /**
     * Processa a requisição.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Executado após a resposta ser enviada ao cliente.
     */
    public function terminate(Request $request, Response $response): void
    {
        // Só rastreia se a resposta HTTP for sucesso (200 OK)
        if ($response->getStatusCode() === 200) {
            $username = $request->route('username');
            if ($username) {
                // Remove caracteres indesejados ou padroniza
                $username = strtolower(trim($username));
                $profile = Profile::where('username', $username)->first();
                
                if ($profile) {
                    $this->analyticsService->trackEvent(
                        $profile->id,
                        'view_profile',
                        null,
                        $request->ip() ?? '127.0.0.1',
                        $request->userAgent(),
                        $request->headers->get('referer')
                    );
                }
            }
        }
    }
}
