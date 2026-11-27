<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookSaved
{
    use Dispatchable, SerializesModels;

    public function __construct(public string $userId) {}
}
