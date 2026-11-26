<?php

namespace App\Http\Requests\Api\V1\Library;

class UpdateBookRequest extends BookMutationRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->bookRules(true);
    }

    /**
     * Normalize legacy API aliases (`rating`, `notes`) into actual DB column names.
     *
     * @return array<string, mixed>
     */
    public function normalizedPayload(): array
    {
        $data = $this->validated();

        if (array_key_exists('rating', $data) && ! array_key_exists('personal_rating', $data)) {
            $data['personal_rating'] = $data['rating'];
        }
        if (array_key_exists('notes', $data) && ! array_key_exists('personal_notes', $data)) {
            $data['personal_notes'] = $data['notes'];
        }
        unset($data['rating'], $data['notes']);

        return $data;
    }
}
