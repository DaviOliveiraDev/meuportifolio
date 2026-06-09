<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $attributes = [
        'reported_type' => 'profile',
        'status' => 'pending',
    ];

    protected $fillable = [
        'reporter_profile_id',
        'reported_profile_id',
        'reported_type',
        'reported_item_id',
        'reason',
        'status',
        'resolution_notes',
        'resolved_by_user_id',
    ];

    /**
     * O perfil que enviou a denúncia.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'reporter_profile_id');
    }

    /**
     * O perfil denunciado.
     */
    public function reportedProfile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'reported_profile_id');
    }

    /**
     * O usuário administrador que resolveu a denúncia.
     */
    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by_user_id');
    }
}
