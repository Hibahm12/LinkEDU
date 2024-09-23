<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Sujet;
use App\Models\professeur;
use App\Models\Etudiant;
use App\Models\Groupe;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class DemandeController extends Controller
{
    public function index()
    {
        return Demande::with(['professeur', 'etudiant', 'sujet'])->get();
        // return  Demande::with(['professeur', 'etudiant', 'sujet.professeur'])->find($demande_id);
    }

    public function store(Request $request)
{
    // Valider les données de la requête
    $validated = $request->validate([
        'cv' => 'nullable|file|mimes:pdf,doc,docx|max:2048', // Validation du fichier CV
        'message' => 'nullable|string',
        'professeur_id' => 'required|exists:professeurs,id',
        'etudiant_id' => 'required|exists:etudiants,id',
        'sujet_id' => 'required|exists:sujets,id',  // Validation du sujet
    ]);

    // Vérifiez si l'étudiant est déjà associé à une demande pour le même professeur et le même sujet
    $existingDemande = Demande::where('professeur_id', $validated['professeur_id'])
                              ->where('etudiant_id', $validated['etudiant_id'])
                              ->where('sujet_id', $validated['sujet_id'])
                              ->exists();

    if ($existingDemande) {
        return response()->json([
            'error' => 'Une demande existe déjà pour cet étudiant, ce professeur et ce sujet.',
        ], 409); // Code de statut 409 pour conflit
    }

    // Traiter le fichier CV si présent
    $cvPath = null;
    if ($request->hasFile('cv')) {
        $cvPath = $request->file('cv')->store('cv', 'public'); // Le fichier est stocké dans `storage/app/public/cv`
    }

    // Créer une nouvelle demande
    $demande = Demande::create([
        'cv' => $cvPath, // Stocke le chemin du fichier dans la base de données
        'message' => $validated['message'] ?? null,
        'professeur_id' => $validated['professeur_id'],
        'etudiant_id' => $validated['etudiant_id'],
        'sujet_id' => $validated['sujet_id'],  // Inclure le sujet_id lors de la création de la demande
    ]);

    // Retourner la réponse JSON avec le code de statut 201 pour la création réussie
    return response()->json($demande, 201);
}



    public function show($id)
{
    try {
        // Récupère la demande avec les relations professeur, étudiant, et sujet
        $demande = Demande::with(['professeur', 'etudiant', 'sujet'])->findOrFail($id);

        // Retourne une réponse JSON avec le modèle Demande et un code de statut 200
        return response()->json($demande, 200);
    } catch (\Throwable $th) {
        // Gère les exceptions en renvoyant une réponse JSON avec un message d'erreur et un code de statut 404
        return response()->json([
            'error' => 'Demande non trouvée.',
            'message' => $th->getMessage(),
        ], 404);
    }
}
    public function destroy($id)
    {
        $demande = Demande::findOrFail($id);
        $demande->delete();

        return response()->json(null, 204);
    }

    public function accept(Request $request, $demande_id)
{
    // Récupérez la demande spécifique à partir de l'identifiant avec les relations
    $demande = Demande::with(['professeur', 'etudiant', 'sujet.professeur'])->find($demande_id);

    if (!$demande) {
        return response()->json(['message' => 'Demande non trouvée.'], 404);
    }

    // Vérifiez si l'étudiant, le sujet et le professeur existent
    $etudiant = $demande->etudiant;
    $sujet = $demande->sujet;
    $professeur = $demande->professeur;

    if (!$etudiant) {
        return response()->json(['message' => 'Étudiant non trouvé.'], 404);
    }

    if (!$sujet) {
        return response()->json(['message' => 'Sujet non trouvé.'], 404);
    }

    if (!$professeur) {
        return response()->json(['message' => 'Professeur non trouvé.'], 404);
    }

    // Créer ou récupérer le groupe
    $groupe = Groupe::firstOrCreate([
        'sujet_id' => $sujet->id,
        'professeur_id' => $professeur->id,
    ], [
        'nom' => 'G-' . $sujet->nom,
    ]);

    // Ajoutez l'étudiant au groupe
    DB::table('groupe_membres')->insert([
        'groupe_id' => $groupe->id,
        'etudiant_id' => $etudiant->id,
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // Modifier l'état de la demande
    $demande->status = 'acceptée';

    // Sauvegarder les changements dans la base de données
    $demande->save();

    // Retourner une réponse JSON indiquant que l'opération a réussi
    return response()->json(['message' => 'Étudiant ajouté avec succès.'], 200);
}



    public function refuse(Request $request, $demande_id)
{
    // Récupérez la demande spécifique à partir de l'identifiant avec les relations
    $demande = Demande::with(['etudiant', 'sujet.professeur'])->find($demande_id);

    if (!$demande) {
        return response()->json(['message' => 'Demande non trouvée.'], 404);
    }

    // Vérifiez si l'étudiant et le sujet existent
    $etudiant = $demande->etudiant;
    $sujet = $demande->sujet;

    if (!$etudiant) {
        return response()->json(['message' => 'Étudiant non trouvé.'], 404);
    }

    if (!$sujet) {
        return response()->json(['message' => 'Sujet non trouvé.'], 404);
    }

    // Modifier l'état de la demande à 'refusée'
    $demande->status = 'refusée';
    $demande->save();

    // notification via un service de notification.

    // Retourner une réponse JSON indiquant que la demande a été refusée avec succès
    return response()->json(['message' => 'Demande refusée avec succès.'], 200);
}


    }

