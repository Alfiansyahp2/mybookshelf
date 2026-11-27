<?php

namespace App\Http\Requests\Api\V1\Accounting;

use App\Http\Requests\Api\V1\ApiFormRequest;

class UploadExpenseReceiptRequest extends ApiFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'receipt' => 'required_without:data|file|mimes:jpeg,jpg,png,webp,pdf|max:10240',
            'data' => 'required_without:receipt|string',
            'mime_type' => 'nullable|string|max:100',
            'filename' => 'nullable|string|max:255',
        ];
    }
}
