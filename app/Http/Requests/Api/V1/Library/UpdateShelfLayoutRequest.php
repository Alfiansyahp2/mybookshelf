<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

class UpdateShelfLayoutRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'shelves' => 'required|array',
            'shelves.*.id' => 'required|uuid',
            'shelves.*.order' => 'required|integer',
            'shelves.*.span' => 'required|integer|min:2|max:12',
        ];
    }
}
