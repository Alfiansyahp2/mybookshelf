<?php

namespace App\Policies;

use App\Models\ExpenseCategory;
use App\Models\User;
use App\Policies\Concerns\ChecksOwnership;
use Illuminate\Auth\Access\Response;

class ExpenseCategoryPolicy
{
    use ChecksOwnership;

    public function view(User $user, ExpenseCategory $category): Response
    {
        return $this->ownsRecord($user, $category);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ExpenseCategory $category): Response
    {
        return $this->ownsRecord($user, $category);
    }

    public function delete(User $user, ExpenseCategory $category): Response
    {
        $ownership = $this->ownsRecord($user, $category);
        if ($ownership->denied()) {
            return $ownership;
        }

        if ($category->is_default) {
            return Response::deny('Cannot delete default expense categories');
        }

        return Response::allow();
    }
}
