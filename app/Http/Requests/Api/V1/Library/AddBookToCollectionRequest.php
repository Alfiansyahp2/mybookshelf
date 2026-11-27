<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

class AddBookToCollectionRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'book_id' => ['required', $this->ownedRule('books')],
            'order' => 'nullable|integer|min:0',
        ];
    }
}
