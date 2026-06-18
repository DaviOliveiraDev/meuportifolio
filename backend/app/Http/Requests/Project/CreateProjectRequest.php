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
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'cover_image_url' => ['nullable', 'url', 'max:2048'],
            'repository_url' => ['nullable', 'url', 'max:2048'],
            'demo_url' => ['nullable', 'url', 'max:2048'],
            'is_featured' => ['nullable', 'boolean'],
            'order_weight' => ['nullable', 'integer', 'min:0'],
            'technologies' => ['nullable', 'array'],
        ];

        $techInput = $this->input('technologies');
        if (is_array($techInput) && count($techInput) > 0) {
            if (is_string(reset($techInput))) {
                $rules['technologies.*'] = ['exists:technologies,id'];
            } else {
                $rules['technologies.*.id'] = ['required', 'exists:technologies,id'];
                $rules['technologies.*.usage_depth'] = ['required', 'string', 'in:used,primary,expert'];
                $rules['technologies.*.is_primary'] = ['required', 'boolean'];
            }
        }

        return $rules;
    }
}
