<?php

namespace App\Domain\Services;

use Illuminate\Http\UploadedFile;

interface StorageServiceInterface
{
    /**
     * Faz upload de uma imagem, opcionalmente convertendo/otimizando-a, e retorna a URL pública.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @return string URL pública do arquivo
     */
    public function uploadImage(UploadedFile $file, string $folder = 'uploads'): string;
}
