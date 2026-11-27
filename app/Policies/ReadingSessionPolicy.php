<?php

namespace App\Policies;

use App\Models\ReadingSession;
use App\Models\User;
use App\Policies\Concerns\ChecksOwnership;
use Illuminate\Auth\Access\Response;

class ReadingSessionPolicy
{
    use ChecksOwnership;

    public function view(User $user, ReadingSession $readingSession): Response
    {
        return $this->ownsRecord($user, $readingSession);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ReadingSession $readingSession): Response
    {
        return $this->ownsRecord($user, $readingSession);
    }

    public function delete(User $user, ReadingSession $readingSession): Response
    {
        return $this->ownsRecord($user, $readingSession);
    }
}
