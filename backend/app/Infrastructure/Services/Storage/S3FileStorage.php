<?php

namespace App\Infrastructure\Services\Storage;

use App\Domain\Services\StorageServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class S3FileStorage implements StorageServiceInterface
{
    public function uploadImage(UploadedFile $file, string $folder = 'uploads'): string
    {
        $optimizedPath = $this->convertToWebp($file);
        $fileName = Str::uuid() . '.webp';
        $fullPath = "{$folder}/{$fileName}";

        // Usa S3 se as credenciais existirem no ambiente, senão faz fallback para local public disk
        $disk = env('AWS_ACCESS_KEY_ID') ? 's3' : 'public';

        if ($optimizedPath !== $file->getRealPath()) {
            Storage::disk($disk)->putFileAs($folder, new \Illuminate\Http\File($optimizedPath), $fileName, 'public');
            @unlink($optimizedPath);
        } else {
            $fileName = $file->hashName();
            Storage::disk($disk)->putFileAs($folder, $file, $fileName, 'public');
            $fullPath = "{$folder}/{$fileName}";
        }

        $storage = Storage::disk($disk);
        if (method_exists($storage, 'url')) {
            return $storage->url($fullPath);
        }

        if ($disk === 's3') {
            $bucket = env('AWS_BUCKET');
            $region = env('AWS_DEFAULT_REGION', 'us-east-1');
            return "https://{$bucket}.s3.{$region}.amazonaws.com/" . ltrim($fullPath, '/');
        }

        return rtrim(env('APP_URL', 'http://localhost'), '/') . '/storage/' . ltrim($fullPath, '/');
    }

    private function convertToWebp(UploadedFile $file): string
    {
        if (!extension_loaded('gd') || !function_exists('imagewebp')) {
            return $file->getRealPath();
        }

        $imagePath = $file->getRealPath();
        $mime = $file->getMimeType();
        
        $image = null;
        switch ($mime) {
            case 'image/jpeg':
            case 'image/jpg':
                $image = @imagecreatefromjpeg($imagePath);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($imagePath);
                if ($image) {
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                }
                break;
            case 'image/gif':
                $image = @imagecreatefromgif($imagePath);
                break;
            case 'image/webp':
                return $imagePath;
        }

        if (!$image) {
            return $imagePath;
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'webp_') . '.webp';
        
        if (imagewebp($image, $tempFile, 80)) {
            imagedestroy($image);
            return $tempFile;
        }

        imagedestroy($image);
        return $imagePath;
    }
}
