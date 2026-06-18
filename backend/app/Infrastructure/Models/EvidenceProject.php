<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenceProject extends Model
{
    use HasFactory;

    protected $table = 'evidence_projects';
    protected $primaryKey = 'evidence_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'evidence_id',
        'title',
        'description',
        'url',
        'repository_url',
        'is_production',
        'user_scale',
        'github_stars',
        'github_forks',
        'npm_downloads',
        'pypi_downloads',
        'is_open_source',
        'license_spdx',
    ];

    protected $casts = [
        'is_production' => 'boolean',
        'is_open_source' => 'boolean',
        'github_stars' => 'integer',
        'github_forks' => 'integer',
        'npm_downloads' => 'integer',
        'pypi_downloads' => 'integer',
    ];

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class, 'evidence_id');
    }
}
