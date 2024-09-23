<?php

namespace App\Http\Controllers;
use Symfony\Component\HttpFoundation\Response;


use App\Models\SujetExtern;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SujetExternController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sujetExterns = SujetExtern::with('etudiant')->get();
        return response()->json(['sujets' => $sujetExterns]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom_entreprise' => 'required|string|max:255',
            'adresse_entreprise' => 'required|string|max:255',
            'titre_sujet' => 'required|string|max:255', // Ajout du champ titre_sujet
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'description' => 'required|string',
        ]);

        $etudiant = Auth::user()->etudiant;

        if (!$etudiant) {
            return response()->json(['message' => 'Authenticated user is not an etudiant'], 403);
        }

        $sujetExtern = SujetExtern::create([
            'nom_entreprise' => $request->nom_entreprise,
            'adresse_entreprise' => $request->adresse_entreprise,
            'titre_sujet' => $request->titre_sujet, // Ajout du champ titre_sujet
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'description' => $request->description,
            'etudiant_id' => $etudiant->id,
        ]);

        return response()->json(['sujet' => $sujetExtern], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sujetExtern = SujetExtern::with('etudiant')->findOrFail($id);
        return response()->json(['sujet' => $sujetExtern]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $etudiant = Auth::user()->etudiant;

        if (!$etudiant) {
            return response()->json(['message' => 'Authenticated user is not an etudiant'], 403);
        }

        $sujetExtern = SujetExtern::findOrFail($id);

        if ($sujetExtern->etudiant_id !== $etudiant->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'nom_entreprise' => 'sometimes|required|string|max:255',
            'adresse_entreprise' => 'sometimes|required|string|max:255',
            'titre_sujet' => 'sometimes|required|string|max:255',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date',
            'description' => 'sometimes|required|string',
        ]);

        $sujetExtern->update($validatedData);

        return response()->json(['message' => 'Sujet updated successfully', 'sujet' => $sujetExtern], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $etudiant = Auth::user()->etudiant;

        if (!$etudiant) {
            return response()->json(['message' => 'Authenticated user is not an etudiant'], 403);
        }

        $sujetExtern = SujetExtern::findOrFail($id);

        if ($sujetExtern->etudiant_id !== $etudiant->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $sujetExtern->delete();

        return response()->json(['message' => 'Sujet Extern deleted successfully']);
    }
}
