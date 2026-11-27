<?php

namespace App\Policies;

use App\Models\Collection;
use App\Models\User;
use App\Policies\Concerns\ChecksOwnership;
use Illuminate\Auth\Access\Response;

class CollectionPolicy
{
    use ChecksOwnership;

    public function view(User $user, Collection $collection): Response
    {
        return $this->ownsRecord($user, $collection);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Collection $collection): Response
    {
        return $this->ownsRecord($user, $collection);
    }

    public function delete(User $user, Collection $collection): Response
    {
        return $this->ownsRecord($user, $collection);
    }
}
