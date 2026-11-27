<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

class BorrowBookRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'borrowed_by' => 'required|string|max:255',
            'due_date' => 'required|date|after:today',
        ];
    }
}
