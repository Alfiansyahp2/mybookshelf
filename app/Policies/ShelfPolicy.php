<?php

namespace App\Policies;

use App\Models\Shelf;
use App\Models\User;
use App\Policies\Concerns\ChecksOwnership;
use Illuminate\Auth\Access\Response;

class ShelfPolicy
{
    use ChecksOwnership;

    public function view(User $user, Shelf $shelf): Response
    {
        return $this->ownsRecord($user, $shelf);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Shelf $shelf): Response
    {
        return $this->ownsRecord($user, $shelf);
    }

    public function delete(User $user, Shelf $shelf): Response
    {
        return $this->ownsRecord($user, $shelf);
    }
}
