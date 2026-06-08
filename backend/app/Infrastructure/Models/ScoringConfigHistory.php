<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScoringConfigHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'scoring_config_history';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'config_id',
        'updated_by_user_id',
        'old_weights',
        'new_weights',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'old_weights' => 'array',
            'new_weights' => 'array',
        ];
    }

    /**
     * Configuração associada.
     */
    public function config(): BelongsTo
    {
        return $this->belongsTo(ScoringConfig::class, 'config_id');
    }

    /**
     * Usuário que realizou a alteração.
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }
}
