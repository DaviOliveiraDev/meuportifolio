<?php

namespace App\Jobs;

use App\Infrastructure\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;
use Throwable;

class GenerateResumePdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * O número de segundos que o job pode rodar antes de expirar.
     */
    public $timeout = 180;

    /**
     * O número de vezes que o job pode ser tentado.
     */
    public $tries = 2;

    /**
     * Cria uma nova instância de Job.
     */
    public function __construct(public Profile $profile)
    {
        $this->onQueue('pdf');
    }

    /**
     * Executa o Job.
     */
    public function handle(): void
    {
        $profileId = $this->profile->id;
        Log::info("Iniciando geração de PDF para o perfil: {$profileId}");

        try {
            Cache::put("pdf_resume_{$profileId}", [
                'status' => 'processing',
                'url' => null,
                'updated_at' => now()->toIso8601String(),
            ], now()->addHours(24));

            // Recarrega o perfil com todos os relacionamentos necessários para o template do currículo
            $profile = Profile::where('id', $profileId)
                ->with([
                    'user',
                    'projects' => function ($query) {
                        $query->orderBy('order_weight')->orderBy('created_at', 'desc');
                    },
                    'experiences' => function ($query) {
                        $query->orderBy('start_date', 'desc');
                    },
                    'educations' => function ($query) {
                        $query->orderBy('start_date', 'desc');
                    },
                    'skills'
                ])
                ->first();

            if (!$profile) {
                throw new \Exception("Perfil não encontrado para geração de PDF.");
            }

            // Renderiza o Blade para HTML string
            $html = view('pdf.resume', compact('profile'))->render();

            // Configura o Browsershot
            $browsershot = Browsershot::html($html)
                ->margins(10, 10, 10, 10)
                ->format('A4')
                ->showBackground();

            // Opções para Docker/Linux e Windows
            if (config('app.env') !== 'local' || env('DOCKER_ENV') || PHP_OS_FAMILY === 'Linux') {
                $browsershot->noSandbox()->disableSetuidSandbox();
            }

            // Permite configurar caminhos customizados pelo .env
            if ($nodePath = env('NODE_BINARY_PATH')) {
                $browsershot->setNodeBinary($nodePath);
            }
            if ($npmPath = env('NPM_BINARY_PATH')) {
                $browsershot->setNpmBinary($npmPath);
            }
            if ($chromePath = env('CHROME_BINARY_PATH')) {
                $browsershot->setChromePath($chromePath);
            }

            // Adiciona flags adicionais caso necessário
            $browsershot->addChromiumArguments([
                '--disable-gpu',
                '--disable-dev-shm-usage',
            ]);

            // Gera o PDF (retorna o conteúdo em formato raw string)
            $pdfContent = $browsershot->pdf();

            // Gravação do PDF no Storage
            $disk = env('AWS_ACCESS_KEY_ID') ? 's3' : 'public';
            $fileName = 'resumes/' . Str::uuid() . '.pdf';
            
            Storage::disk($disk)->put($fileName, $pdfContent, 'public');
            $url = Storage::disk($disk)->url($fileName);

            Log::info("PDF gerado com sucesso para o perfil {$profileId}. Salvo em: {$fileName}");

            Cache::put("pdf_resume_{$profileId}", [
                'status' => 'completed',
                'url' => $url,
                'updated_at' => now()->toIso8601String(),
            ], now()->addHours(24));

            // Concede XP e atualiza a carta por gerar PDF
            $xpManager = app(\App\Domain\Services\XpManagerService::class);
            $xpManager->awardXpForAction($profile, 'generate_pdf');
            \App\Jobs\UpdateDeveloperCardJob::dispatch($profile);

        } catch (Throwable $e) {
            Log::error("Erro na geração de PDF para o perfil {$profileId}: " . $e->getMessage(), [
                'exception' => $e
            ]);

            Cache::put("pdf_resume_{$profileId}", [
                'status' => 'failed',
                'error' => $e->getMessage(),
                'updated_at' => now()->toIso8601String(),
            ], now()->addHours(24));

            throw $e;
        }
    }

    /**
     * Trata a falha definitiva do Job.
     */
    public function failed(Throwable $exception): void
    {
        $profileId = $this->profile->id;
        Log::error("Job GenerateResumePdfJob falhou definitivamente para o perfil {$profileId}.");
        
        Cache::put("pdf_resume_{$profileId}", [
            'status' => 'failed',
            'error' => 'Geração falhou após várias tentativas: ' . $exception->getMessage(),
            'updated_at' => now()->toIso8601String(),
        ], now()->addHours(24));
    }
}
