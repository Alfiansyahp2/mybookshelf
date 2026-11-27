<?php

namespace App\Policies;

use App\Models\Book;
use App\Models\User;
use App\Policies\Concerns\ChecksOwnership;
use Illuminate\Auth\Access\Response;

class BookPolicy
{
    use ChecksOwnership;

    public function view(User $user, Book $book): Response
    {
        return $this->ownsRecord($user, $book);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Book $book): Response
    {
        return $this->ownsRecord($user, $book);
    }

    public function delete(User $user, Book $book): Response
    {
        return $this->ownsRecord($user, $book);
    }
}
