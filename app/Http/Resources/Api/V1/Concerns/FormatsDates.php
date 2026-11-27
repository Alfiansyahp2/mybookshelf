<?php

namespace App\Http\Resources\Api\V1\Concerns;

use Carbon\Carbon;
use DateTimeInterface;

trait FormatsDates
{
    /**
     * Safely normalize a DateTimeInterface or date string to ISO-8601 format.
     */
    protected function toIso8601(mixed $value): ?string
    {
        if ($value instanceof DateTimeInterface) {
            return Carbon::instance($value)->toIso8601String();
        }

        if (is_string($value) && trim($value) !== '') {
            return Carbon::parse($value)->toIso8601String();
        }

        return null;
    }
}
