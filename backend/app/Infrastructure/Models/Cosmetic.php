<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Cosmetic extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'type', // border, background, effect
        'value',
        'unlock_badge_id',
    ];

    /**
     * Badge que desbloqueia este cosmético (opcional).
     */
    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class, 'unlock_badge_id');
    }

    /**
     * Perfis que possuem este cosmético.
     */
    public function profiles(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, 'profile_cosmetics')
                    ->withPivot('is_equipped', 'unlocked_at');
    }
}
