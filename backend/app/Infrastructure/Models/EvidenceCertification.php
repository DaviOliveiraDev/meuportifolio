<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenceCertification extends Model
{
    use HasFactory;

    protected $table = 'evidence_certifications';
    protected $primaryKey = 'evidence_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'evidence_id',
        'cert_name',
        'issuer',
        'credential_url',
        'external_id',
        'badge_image_url',
        'is_verified',
        'verified_via',
        'expires_at',
        'issuer_tier',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class, 'evidence_id');
    }
}
