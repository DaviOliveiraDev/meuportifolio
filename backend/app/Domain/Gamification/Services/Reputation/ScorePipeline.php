<?php

namespace App\Domain\Gamification\Services\Reputation;

use App\Infrastructure\Models\Evidence;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ScorePipeline
{
    public function __construct(
        protected EvidenceNormalizer $normalizer,
        protected SkillScoreCalculator $skillCalc,
        protected DomainAggregator $domainAgg,
        protected OVRCalculator $ovrCalc,
        protected RecruiterScoreCalculator $recruiterCalc,
        protected DNAProfileBuilder $dnaBuilder,
        protected ScorePersister $persister
    ) {}

    /**
     * Executa o pipeline completo de pontuação para o usuário.
     */
    public function execute(string $userId): UserReputationResult
    {
        Log::info("ScorePipeline: Executando pipeline para o usuário {$userId}");

        // 1. Carregar todas as evidências do usuário
        $evidences = $this->loadEvidences($userId);

        // 2. Normalizar evidências em pesos brutos
        $weights = $this->normalizer->normalize($evidences);

        // 3. Calcular scores de tecnologias (Skill Scores)
        $skillScores = $this->skillCalc->calculate($userId, $weights);

        // 4. Agregar em competências e domínios (Domain Scores)
        $domainScores = $this->domainAgg->aggregate($userId, $skillScores);

        // 5. Calcular OVR
        $ovr = $this->ovrCalc->calculate($userId, $domainScores, $evidences);

        // 6. Calcular Recruiter Score
        $recruiterScore = $this->recruiterCalc->calculate($userId, $evidences, $domainScores);

        // 7. Construir perfil de DNA Tecnológico
        $dna = $this->dnaBuilder->build($userId, $domainScores, $skillScores);

        // 8. Persistir os scores recalculados
        return $this->persister->persist($userId, [
            'skill_scores' => $skillScores,
            'domain_scores' => $domainScores,
            'ovr' => $ovr,
            'recruiter_score' => $recruiterScore,
            'dna' => $dna,
        ]);
    }

    /**
     * Carrega as evidências associadas ao usuário.
     */
    protected function loadEvidences(string $userId): Collection
    {
        return Evidence::where('user_id', $userId)
            ->where('is_active', true)
            ->get();
    }
}

class UserReputationResult
{
    public function __construct(
        public readonly string $userId,
        public readonly float $ovr,
        public readonly float $recruiterScore,
        public readonly float $previousOvr,
        public readonly array $data
    ) {}

    /**
     * Determina se houve mudança significativa de OVR para disparar eventos.
     */
    public function hasSignificantChange(): bool
    {
        return round($this->ovr) !== round($this->previousOvr);
    }
}
