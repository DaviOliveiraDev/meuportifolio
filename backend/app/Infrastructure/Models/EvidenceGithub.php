<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenceGithub extends Model
{
    use HasFactory;

    protected $table = 'evidence_github';
    protected $primaryKey = 'evidence_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'evidence_id',
        'github_repo_id',
        'repo_full_name',
        'repo_url',
        'stars',
        'forks',
        'open_issues',
        'subscribers',
        'has_readme',
        'has_tests',
        'has_ci',
        'license_spdx',
        'npm_dependents',
        'pypi_dependents',
        'commits_count',
        'prs_merged',
        'issues_opened',
        'is_owner',
        'languages',
        'last_commit_at',
        'synced_at',
    ];

    protected $casts = [
        'github_repo_id' => 'integer',
        'stars' => 'integer',
        'forks' => 'integer',
        'open_issues' => 'integer',
        'subscribers' => 'integer',
        'has_readme' => 'boolean',
        'has_tests' => 'boolean',
        'has_ci' => 'boolean',
        'npm_dependents' => 'integer',
        'pypi_dependents' => 'integer',
        'commits_count' => 'integer',
        'prs_merged' => 'integer',
        'issues_opened' => 'integer',
        'is_owner' => 'boolean',
        'languages' => 'array',
        'last_commit_at' => 'datetime',
        'synced_at' => 'datetime',
    ];

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class, 'evidence_id');
    }
}
