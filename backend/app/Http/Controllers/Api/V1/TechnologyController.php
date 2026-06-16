<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Infrastructure\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class TechnologyController extends Controller
{
    /**
     * Autocomplete de busca de tecnologias por nome ou aliases.
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $search = $request->input('q');

        if (empty($search)) {
            return response()->json([]);
        }

        $query = Technology::query()
            ->where('status', 'active');

        if (DB::getDriverName() === 'pgsql') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhereRaw("aliases::text ilike ?", ["%{$search}%"]);
            });
        } else {
            // Fallback para SQLite/MySQL
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('aliases', 'like', "%{$search}%");
            });
        }

        // Limita a 15 resultados para performance do autocomplete
        $technologies = $query->limit(15)->get();

        return response()->json($technologies);
    }
}
