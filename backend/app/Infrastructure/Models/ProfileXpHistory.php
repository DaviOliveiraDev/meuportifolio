<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileXpHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'profile_xp_history';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false; // We use created_at manually via migration default

    protected $fillable = [
        'profile_id',
        'action',
        'amount',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
