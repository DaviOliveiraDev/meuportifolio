<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // A validação de posse do recurso é feita no controller / policy, 
        // mas o request apenas valida dados
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'cover_image_url' => ['nullable', 'url', 'max:2048'],
            'repository_url' => ['nullable', 'url', 'max:2048'],
            'demo_url' => ['nullable', 'url', 'max:2048'],
            'is_featured' => ['nullable', 'boolean'],
            'order_weight' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
