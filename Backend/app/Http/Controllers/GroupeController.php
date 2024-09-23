<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use Illuminate\Http\Request;

class GroupeController extends Controller
{
    public function index(Groupe $groupe)
    {
        // Fetch tasks related to the given groupe
        $etudiants = $groupe->etudiants()->get();

        // You can further process the tasks or pass them to a view
        return response()->json([
            'success' => true,
            'message' => 'etudiants of group fetched successfully',
            'members' => $etudiants, // Assuming $tasks is a collection of Task instances
        ]);
    }


    public function professeur(Groupe $groupe)
    {
        $professeur = $groupe->professeur()->with('user')->first();

        return response()->json([
            'professeur' => $professeur,
        ]);
    }

}
