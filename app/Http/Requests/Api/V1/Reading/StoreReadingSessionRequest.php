<?php

namespace App\Http\Requests\Api\V1\Reading;

use App\Http\Requests\Api\V1\ApiFormRequest;

class StoreReadingSessionRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'book_id' => ['required', $this->ownedRule('books')],
            'start_time' => 'required|date',
            'start_page' => 'required|integer|min:0',
            'mood' => 'nullable|in:great,good,okay,difficult',
            'location' => 'nullable|string|max:255',
        ];
    }
}
