<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileRatingsHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'profile_ratings_history';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'ovr',
        'xp',
        'level',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'ovr' => 'integer',
            'xp' => 'integer',
            'level' => 'integer',
            'recorded_at' => 'date',
        ];
    }

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
