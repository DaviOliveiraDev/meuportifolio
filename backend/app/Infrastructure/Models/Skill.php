<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'category',
    ];

    /**
     * Retorna a factory correspondente ao model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\SkillFactory::new();
    }

    /**
     * Relação N:N com os perfis que possuem essa habilidade.
     */
    public function profiles(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, 'profile_skills')
                    ->withPivot('proficiency_level');
    }
}
