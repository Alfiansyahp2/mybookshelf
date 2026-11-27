<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

class UpdateShelfRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'order' => 'sometimes|integer|min:0',
            'span' => 'sometimes|integer|min:2|max:12',
            'decorations' => 'sometimes|array|nullable',
        ];
    }
}
