<?php

namespace App\Domain\Services;

use App\Infrastructure\Models\Profile;
use App\Domain\Gamification\Services\BadgeEvaluatorService as NewBadgeEvaluator;

class BadgeEvaluatorService
{
    protected NewBadgeEvaluator $newBadgeEvaluator;

    public function __construct()
    {
        $this->newBadgeEvaluator = app(NewBadgeEvaluator::class);
    }

    /**
     * Avalia e concede as conquistas (badges) que o desenvolvedor atinge.
     */
    public function evaluateAndAwardBadges(Profile $profile): void
    {
        $this->newBadgeEvaluator->evaluateAndAwardBadges($profile);
    }
}
