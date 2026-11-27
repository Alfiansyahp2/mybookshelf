<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

class BookIndexRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|max:50',
            'statuses' => 'nullable|string|max:255',
            'exclude_statuses' => 'nullable|string|max:255',
            'shelf_id' => 'nullable|string|max:64',
            'favorite' => 'nullable',
            'is_returned' => 'nullable',
            'overdue' => 'nullable',
            'borrowed_by' => 'nullable|string|max:150',
            'has_notes' => 'nullable',
            'genre' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1900|max:2100',
            'per_page' => 'nullable|integer|min:1|max:500',
            'page' => 'nullable|integer|min:1',
        ];
    }
}
