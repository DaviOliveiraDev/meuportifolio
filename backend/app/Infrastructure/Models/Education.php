<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'educations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'institution',
        'course',
        'start_date',
        'end_date',
        'is_current',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
        ];
    }

    /**
     * Retorna a factory correspondente ao model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\EducationFactory::new();
    }

    /**
     * Relação com o perfil.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
