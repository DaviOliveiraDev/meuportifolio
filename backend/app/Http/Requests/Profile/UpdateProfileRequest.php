<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $profileId = $this->user()->profile?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'min:3',
                'max:50',
                'unique:profiles,username,' . $profileId
            ],
            'avatar_url' => ['nullable', 'url', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'role' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'github_url' => ['nullable', 'url', 'max:2048'],
            'website_url' => ['nullable', 'url', 'max:2048'],
            'theme_name' => ['required', 'string', 'in:minimalist,modern,dark,light'],
            'custom_styles' => ['nullable', 'array'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:50'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'username.unique' => 'Este nome de usuário já está sendo utilizado.',
            'username.alpha_dash' => 'O nome de usuário deve conter apenas letras, números, traços e underscores.',
            'theme_name.in' => 'O tema selecionado é inválido.',
        ];
    }
}
