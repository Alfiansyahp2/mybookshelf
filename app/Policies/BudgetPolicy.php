<?php

namespace App\Policies;

use App\Models\Budget;
use App\Models\User;
use App\Policies\Concerns\ChecksOwnership;
use Illuminate\Auth\Access\Response;

class BudgetPolicy
{
    use ChecksOwnership;

    public function view(User $user, Budget $budget): Response
    {
        return $this->ownsRecord($user, $budget);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Budget $budget): Response
    {
        return $this->ownsRecord($user, $budget);
    }

    public function delete(User $user, Budget $budget): Response
    {
        return $this->ownsRecord($user, $budget);
    }
}
