<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;

abstract class ApiFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Build a Rule::exists scoped to the authenticated user's records.
     */
    protected function ownedRule(string $table): Exists
    {
        return Rule::exists($table, 'id')->where(
            'user_id',
            $this->user()?->id
        );
    }

    /**
     * Reusable hex color validation rules.
     *
     * @return list<string>
     */
    protected function hexColorRule(): array
    {
        return ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'];
    }
}
