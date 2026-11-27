<?php

namespace App\Http\Requests\Api\V1\Reading;

use App\Http\Requests\Api\V1\ApiFormRequest;

class UpdateReadingSessionRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'end_time' => 'required|date',
            'end_page' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
