<?php

namespace App\Domain\Gamification\Services\Reputation;

use App\Infrastructure\Models\Evidence;
use App\Infrastructure\Models\EvidenceProject;
use App\Infrastructure\Models\EvidenceExperience;
use App\Infrastructure\Models\EvidenceEducation;
use App\Infrastructure\Models\Project;
use App\Infrastructure\Models\Experience;
use App\Infrastructure\Models\Education;
use App\Infrastructure\Models\Technology;
use Illuminate\Support\Facades\DB;

class EvidenceSyncService
{
    /**
     * Sincroniza dados do Project com tabelas de Evidências.
     */
    public function syncProject(Project $project, ?array $technologiesInput): void
    {
        if (!$project->profile) {
            return;
        }

        DB::transaction(function () use ($project, $technologiesInput) {
            $userId = $project->profile->user_id;

            $evidence = Evidence::updateOrCreate(
                ['id' => $project->evidence_id],
                [
                    'user_id' => $userId,
                    'evidence_type' => 'project',
                    'verification_level' => 'self_declared',
                    'is_active' => true,
                ]
            );

            if ($project->evidence_id !== $evidence->id) {
                $project->evidence_id = $evidence->id;
                $project->saveQuietly();
            }

            EvidenceProject::updateOrCreate(
                ['evidence_id' => $evidence->id],
                [
                    'title' => $project->title,
                    'description' => $project->description,
                    'url' => $project->demo_url,
                    'repository_url' => $project->repository_url,
                    'is_production' => $project->is_featured,
                    'user_scale' => 'personal',
                ]
            );

            $this->syncTechnologies($evidence, $technologiesInput);
        });
    }

    /**
     * Sincroniza dados do Experience com tabelas de Evidências.
     */
    public function syncExperience(Experience $experience, ?array $technologiesInput): void
    {
        if (!$experience->profile) {
            return;
        }

        DB::transaction(function () use ($experience, $technologiesInput) {
            $userId = $experience->profile->user_id;

            $evidence = Evidence::updateOrCreate(
                ['id' => $experience->evidence_id],
                [
                    'user_id' => $userId,
                    'evidence_type' => 'experience',
                    'verification_level' => 'self_declared',
                    'is_active' => true,
                    'start_date' => $experience->start_date,
                    'end_date' => $experience->end_date,
                    'is_current' => $experience->is_current,
                ]
            );

            if ($experience->evidence_id !== $evidence->id) {
                $experience->evidence_id = $evidence->id;
                $experience->saveQuietly();
            }

            EvidenceExperience::updateOrCreate(
                ['evidence_id' => $evidence->id],
                [
                    'company_name' => $experience->company,
                    'role_title' => $experience->role,
                    'description' => $experience->description,
                    'employment_type' => 'full_time',
                    'company_tier' => 'company',
                ]
            );

            $this->syncTechnologies($evidence, $technologiesInput);
        });
    }

    /**
     * Sincroniza dados do Education com tabelas de Evidências.
     */
    public function syncEducation(Education $education, ?array $technologiesInput): void
    {
        if (!$education->profile) {
            return;
        }

        DB::transaction(function () use ($education, $technologiesInput) {
            $userId = $education->profile->user_id;

            $evidence = Evidence::updateOrCreate(
                ['id' => $education->evidence_id],
                [
                    'user_id' => $userId,
                    'evidence_type' => 'education',
                    'verification_level' => 'self_declared',
                    'is_active' => true,
                    'start_date' => $education->start_date,
                    'end_date' => $education->end_date,
                    'is_current' => $education->is_current,
                ]
            );

            if ($education->evidence_id !== $evidence->id) {
                $education->evidence_id = $evidence->id;
                $education->saveQuietly();
            }

            EvidenceEducation::updateOrCreate(
                ['evidence_id' => $evidence->id],
                [
                    'institution_name' => $education->institution,
                    'degree_type' => 'degree',
                    'field_of_study' => $education->course,
                    'institution_tier' => 'other',
                ]
            );

            $this->syncTechnologies($evidence, $technologiesInput);
        });
    }

    /**
     * Salva as tecnologias vinculadas com a respectiva profundidade.
     */
    protected function syncTechnologies(Evidence $evidence, ?array $technologiesInput): void
    {
        if ($technologiesInput === null) {
            return;
        }

        $syncData = [];
        foreach ($technologiesInput as $item) {
            $pivotId = (string) \Illuminate\Support\Str::uuid();
            if (is_string($item)) {
                // Formato legado: array simples de UUIDs
                $syncData[$item] = [
                    'id' => $pivotId,
                    'usage_depth' => 'used',
                    'is_primary' => false,
                ];
            } elseif (is_array($item)) {
                // Formato novo: array de objetos { id/technology_id, usage_depth, is_primary }
                $id = $item['id'] ?? $item['technology_id'] ?? null;
                if ($id) {
                    $syncData[$id] = [
                        'id' => $pivotId,
                        'usage_depth' => $item['usage_depth'] ?? 'used',
                        'is_primary' => $item['is_primary'] ?? false,
                    ];
                }
            }
        }

        $evidence->technologies()->sync($syncData);
    }
}
