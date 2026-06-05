<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
        return [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required', 
                'string', 
                'alpha_dash', 
                'min:3', 
                'max:50', 
                'unique:profiles,username'
            ],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Este endereço de e-mail já está cadastrado.',
            'username.unique' => 'Este nome de usuário já está sendo utilizado.',
            'username.alpha_dash' => 'O nome de usuário deve conter apenas letras, números, traços e underscores.',
        ];
    }
}
