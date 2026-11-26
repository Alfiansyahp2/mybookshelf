<?php

namespace App\Policies;

use App\Models\Expense;
use App\Models\User;
use App\Policies\Concerns\ChecksOwnership;
use Illuminate\Auth\Access\Response;

class ExpensePolicy
{
    use ChecksOwnership;

    public function view(User $user, Expense $expense): Response
    {
        return $this->ownsRecord($user, $expense);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Expense $expense): Response
    {
        return $this->ownsRecord($user, $expense);
    }

    public function delete(User $user, Expense $expense): Response
    {
        return $this->ownsRecord($user, $expense);
    }
}
