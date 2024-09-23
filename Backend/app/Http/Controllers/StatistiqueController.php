<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Professeur;
use App\Models\Etudiant;
use App\Models\Sujet;

class StatistiqueController extends Controller
{
    public function total()
    {
        $totalProfesseurs = Professeur::count();
        $totalEtudiants = Etudiant::count();
        $totalSujet = Sujet::count();

        return response()->json([
            'total_professeurs' => $totalProfesseurs,
            'total_etudiants' => $totalEtudiants,
            'total_Sujet' => $totalSujet

        ]);
    }
    }
