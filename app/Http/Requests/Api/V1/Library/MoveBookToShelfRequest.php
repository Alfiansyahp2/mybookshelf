<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

class MoveBookToShelfRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'shelf_id' => ['required', $this->ownedRule('shelves')],
            'position' => 'nullable|integer|min:0',
        ];
    }
}
