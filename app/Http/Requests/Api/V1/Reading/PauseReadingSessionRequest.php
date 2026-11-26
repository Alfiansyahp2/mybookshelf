<?php

namespace App\Http\Requests\Api\V1\Reading;

use App\Http\Requests\Api\V1\ApiFormRequest;

class PauseReadingSessionRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'is_paused' => 'required|boolean',
        ];
    }
}
