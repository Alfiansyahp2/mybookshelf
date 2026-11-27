<?php

namespace App\Policies\Concerns;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;

trait ChecksOwnership
{
    /**
     * Ensure the authenticated user owns the target model, returning 404 on mismatch to prevent ID enumeration.
     */
    protected function ownsRecord(User $user, Model $record): Response
    {
        return $user->id === $record->getAttribute('user_id')
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
