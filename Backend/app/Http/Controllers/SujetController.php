<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Sujet;
use App\Models\Groupe;

class SujetController extends Controller
{
    public function index()
    {
        $sujets = Sujet::with('professeur')->paginate(15);
        $paginationData = [
            'total' => $sujets->total(),
            'per_page' => $sujets->perPage(),
            'current_page' => $sujets->currentPage(),
            'last_page' => $sujets->lastPage(),
            'first_page_url' => $sujets->url(1),
            'last_page_url' => $sujets->url($sujets->lastPage()),
            'next_page_url' => $sujets->nextPageUrl(),
            'prev_page_url' => $sujets->previousPageUrl(),
            'path' => $sujets->path(),
            'from' => $sujets->firstItem(),
            'to' => $sujets->lastItem(),
        ];
        $response = [
            'sujets' => $sujets->items(),
            'pagination' => $paginationData,
        ];

        return response()->json($response);
    }

    public function show($id)
    {
        $sujet = Sujet::with('professeur')->find($id);

        if ($sujet) {
            return response()->json($sujet);
        } else {
            return response()->json(["message" => "Sujet not found"], Response::HTTP_NOT_FOUND);
        }
    }
    
    public function store(Request $request)
    {
        // Validation des données de la requête
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'annee' => 'required|string|max:9',  // Validation du champ annee
            'professeur_id' => 'required|integer|exists:professeurs,id'
        ]);
        
        // Création du sujet
        $sujet = Sujet::create($request->all());
        
        // Récupération des IDs du sujet et du professeur
        $sujetId = $sujet->id;
        $professeurId = $request->input('professeur_id');

        // Créez le groupe
        $groupeNom = 'G-' . $sujet->nom;
        $groupe = Groupe::create([
            'nom' => $groupeNom,
            'sujet_id' => $sujetId,
            'professeur_id' => $professeurId,
        ]);
    
        return response()->json([
            'status' => 'Request was successful',
            'message' => 'Sujet created successfully',
            'data' => [
                'sujet' => $sujet,
                'sujet_id' => $sujetId,
                'professeur_id' => $professeurId
            ]
        ], Response::HTTP_CREATED);
    }
    



    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'annee' => 'sometimes|required|string|max:9', // Ensure the annee field can be updated
            'professeur_id' => 'sometimes|required|integer|exists:professeurs,id'
        ]);

        $sujet = Sujet::findOrFail($id);
        $sujet->update($validatedData);

        return response()->json([
            'message' => 'Sujet updated successfully',
            'data' => $sujet
        ], Response::HTTP_OK);
    }


public function destroy($id)
    {
        $sujet = Sujet::findOrFail($id);
        $sujet->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
