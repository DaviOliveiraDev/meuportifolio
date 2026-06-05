<?php

namespace Tests\Feature;

use App\Infrastructure\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UploadApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_upload_images(): void
    {
        $response = $this->postJson('/api/v1/upload', []);
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_upload_valid_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // 1x1 Pixel JPEG base64 (para evitar dependência da extensão GD na geração do fake no teste)
        $base64Image = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
        $tempFilePath = tempnam(sys_get_temp_dir(), 'test_img_') . '.jpg';
        file_put_contents($tempFilePath, base64_decode($base64Image));

        $file = new UploadedFile($tempFilePath, 'avatar.jpg', 'image/jpeg', null, true);

        $response = $this->postJson('/api/v1/upload', [
            'image' => $file,
            'folder' => 'avatars',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'url']);

        $files = Storage::disk('public')->allFiles('avatars');
        $this->assertCount(1, $files);
        
        if (extension_loaded('gd') && function_exists('imagewebp')) {
            $this->assertStringEndsWith('.webp', $files[0]);
        } else {
            $this->assertStringEndsWith('.jpg', $files[0]);
        }

        if (file_exists($tempFilePath)) {
            @unlink($tempFilePath);
        }
    }

    public function test_upload_fails_for_invalid_file_type(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $file = UploadedFile::fake()->create('document.txt', 100, 'text/plain');

        $response = $this->postJson('/api/v1/upload', [
            'image' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image']);
    }
}
