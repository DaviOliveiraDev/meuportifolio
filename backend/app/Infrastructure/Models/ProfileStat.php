<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileStat extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'profile_stats';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'total_projects',
        'total_experiences',
        'total_educations',
        'total_skills',
        'total_badges',
        'total_titles',
        'github_connected',
        'github_repositories',
        'github_commits',
        'github_stars',
        'profile_views',
        'profile_shares',
        'community_points',
        'streak_days',
        'current_xp',
        'current_level',
        'current_ovr',
    ];

    protected function casts(): array
    {
        return [
            'total_projects' => 'integer',
            'total_experiences' => 'integer',
            'total_educations' => 'integer',
            'total_skills' => 'integer',
            'total_badges' => 'integer',
            'total_titles' => 'integer',
            'github_connected' => 'boolean',
            'github_repositories' => 'integer',
            'github_commits' => 'integer',
            'github_stars' => 'integer',
            'profile_views' => 'integer',
            'profile_shares' => 'integer',
            'community_points' => 'integer',
            'streak_days' => 'integer',
            'current_xp' => 'integer',
            'current_level' => 'integer',
            'current_ovr' => 'integer',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
