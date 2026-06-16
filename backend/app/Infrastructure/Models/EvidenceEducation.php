<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenceEducation extends Model
{
    use HasFactory;

    protected $table = 'evidence_education';
    protected $primaryKey = 'evidence_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'evidence_id',
        'institution_name',
        'degree_type',
        'field_of_study',
        'grade',
        'institution_tier',
    ];

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class, 'evidence_id');
    }
}
