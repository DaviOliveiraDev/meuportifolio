<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnologySuggestion extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'technology_suggestions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'suggested_by',
        'name',
        'slug_suggestion',
        'category',
        'competency_ids',
        'reason',
        'vote_count',
        'status',
        'duplicate_of',
        'reviewed_by',
    ];

    protected $casts = [
        'competency_ids' => 'array',
        'vote_count' => 'integer',
    ];

    public function suggester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'suggested_by');
    }

    public function duplicateOf(): BelongsTo
    {
        return $this->belongsTo(Technology::class, 'duplicate_of');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
