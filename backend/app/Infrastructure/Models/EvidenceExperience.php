<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenceExperience extends Model
{
    use HasFactory;

    protected $table = 'evidence_experiences';
    protected $primaryKey = 'evidence_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'evidence_id',
        'company_name',
        'role_title',
        'description',
        'employment_type',
        'company_tier',
        'company_size',
        'linkedin_url',
    ];

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class, 'evidence_id');
    }
}
