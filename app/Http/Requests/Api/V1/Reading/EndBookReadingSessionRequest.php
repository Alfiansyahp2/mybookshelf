<?php

namespace App\Http\Requests\Api\V1\Reading;

use App\Http\Requests\Api\V1\ApiFormRequest;

class EndBookReadingSessionRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'end_page' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
