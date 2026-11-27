<?php

namespace App\Http\Requests\Api\V1\Library;

use App\Http\Requests\Api\V1\ApiFormRequest;

class UploadBookCoverRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'cover' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
        ];
    }
}
