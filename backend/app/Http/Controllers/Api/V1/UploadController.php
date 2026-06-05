<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Services\StorageServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function __construct(
        private readonly StorageServiceInterface $storageService
    ) {}

    /**
     * Realiza o upload de um arquivo de imagem.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'], // máximo 5MB
            'folder' => ['nullable', 'string', 'alpha_dash', 'max:50'],
        ]);

        $file = $request->file('image');
        $folder = $request->input('folder', 'uploads');

        try {
            $url = $this->storageService->uploadImage($file, $folder);

            return response()->json([
                'message' => 'Imagem enviada com sucesso.',
                'url' => $url,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao processar o upload da imagem.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
