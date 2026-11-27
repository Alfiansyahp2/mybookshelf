<?php

namespace App\Events;

use App\Models\ReadingSession;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReadingSessionCompleted
{
    use Dispatchable, SerializesModels;

    public function __construct(public ReadingSession $session) {}
}
