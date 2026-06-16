<?php

namespace App\Http\Requests\Education;

use Illuminate\Foundation\Http\FormRequest;

class CreateEducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'institution' => ['required', 'string', 'max:255'],
            'course' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_current' => ['required', 'boolean'],
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
