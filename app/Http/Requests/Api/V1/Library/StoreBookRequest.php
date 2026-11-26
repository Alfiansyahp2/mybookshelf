<?php

namespace App\Http\Requests\Api\V1\Library;

class StoreBookRequest extends BookMutationRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->bookRules(false);
    }
}
