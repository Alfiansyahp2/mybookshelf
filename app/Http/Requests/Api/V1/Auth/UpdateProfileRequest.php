<?php

namespace App\Http\Requests\Api\V1\Auth;

use App\Http\Requests\Api\V1\ApiFormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->user()?->id),
            ],
        ];
    }
}
