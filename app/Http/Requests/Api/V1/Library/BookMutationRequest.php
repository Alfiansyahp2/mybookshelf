<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

abstract class BookMutationRequest extends ApiFormRequest
{
    /**
     * Shared validation rules for creating and updating books.
     *
     * @return array<string, mixed>
     */
    protected function bookRules(bool $isUpdate): array
    {
        $titleAndAuthorRule = $isUpdate ? 'sometimes|required|string|max:255' : 'required|string|max:255';

        $rules = [
            'title' => $titleAndAuthorRule,
            'author' => $titleAndAuthorRule,
            'isbn' => 'nullable|string|max:50',
            'genre' => 'nullable|string|max:100',
            'language' => 'nullable|string|max:50',
            'publisher' => 'nullable|string|max:255',
            'publish_year' => 'nullable|integer|min:1000|max:2999',
            'pages' => 'nullable|integer|min:1',
            'format' => 'nullable|in:hardcover,paperback,ebook,audiobook',
            'spine_color_light' => $this->hexColorRule(),
            'spine_color_medium' => $this->hexColorRule(),
            'spine_color_dark' => $this->hexColorRule(),
            'height' => 'nullable|in:short,medium,tall',
            'thickness' => 'nullable|in:thin,regular,thick',
            'status' => 'nullable|in:unread,reading,finished,wishlist,borrowed',
            'favorite' => 'nullable|boolean',
            'current_page' => 'nullable|integer|min:0',
            'progress' => 'nullable|numeric|between:0,100',
            'started_date' => 'nullable|date',
            'finished_date' => 'nullable|date|after:started_date',
            'personal_notes' => 'nullable|string',
            'personal_rating' => 'nullable|numeric|between:0,5',
            'read_dates' => 'nullable|array',
            'read_dates.*' => 'date',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0',
            'purchase_currency' => 'nullable|string|size:3',
            'is_gift' => 'nullable|boolean',
            'purchase_location' => 'nullable|string|max:255',
            'shelf_id' => ['nullable', $this->ownedRule('shelves')],
        ];

        if ($isUpdate) {
            $rules['rating'] = 'nullable|numeric|between:0,5';
            $rules['notes'] = 'nullable|string';
        } else {
            $rules['position'] = 'nullable|integer|min:0';
        }

        return $rules;
    }
}
