<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Groupe;
use App\Models\Etudiant;
use App\Models\GroupeMembre; // Assurez-vous que cette ligne est présente

class GroupeMembreController extends Controller
{
    // Créer un nouveau membre dans un groupe
    public function store(Request $request)
    {
        $request->validate([
            'groupe_id' => 'required|exists:groupes,id',
            'etudiant_id' => 'required|exists:etudiants,id|unique:groupe_membres,etudiant_id',
        ]);

        $groupeMembre = GroupeMembre::create([
            'groupe_id' => $request->groupe_id,
            'etudiant_id' => $request->etudiant_id,
        ]);

        return response()->json(['message' => 'Membre ajouté au groupe avec succès.', 'data' => $groupeMembre], 201);
    }

    // Lire tous les membres d'un groupe
    public function index($groupe_id)
    {
        $membres = GroupeMembre::where('groupe_id', $groupe_id)->with('etudiant')->get();
        return response()->json(['data' => $membres], 200);
    }

    // Mettre à jour un membre d'un groupe
    public function update(Request $request, $id)
    {
        $request->validate([
            'groupe_id' => 'sometimes|required|exists:groupes,id',
            'etudiant_id' => 'sometimes|required|exists:etudiants,id|unique:groupe_membres,etudiant_id,' . $id,
        ]);

        $groupeMembre = GroupeMembre::find($id);

        if (!$groupeMembre) {
            return response()->json(['message' => 'Membre non trouvé.'], 404);
        }

        $groupeMembre->update($request->only(['groupe_id', 'etudiant_id']));

        return response()->json(['message' => 'Membre mis à jour avec succès.', 'data' => $groupeMembre], 200);
    }

    // Supprimer un membre d'un groupe
    public function destroy($id)
    {
        $groupeMembre = GroupeMembre::find($id);

        if (!$groupeMembre) {
            return response()->json(['message' => 'Membre non trouvé.'], 404);
        }

        $groupeMembre->delete();

        return response()->json(['message' => 'Membre supprimé avec succès.'], 200);
    }
    public function getMembershipByStudent($etudiant_id)
{
    $membre = GroupeMembre::where('etudiant_id', $etudiant_id)->first();

    if ($membre) {
        return response()->json(['data' => $membre, 'message' => 'Student is in a group.'], 200);
    } else {
        return response()->json(['message' => 'Student is not in any group.'], 404);
    }
}
public function getStudentsInSameGroup($etudiant_id)
    {
        // Find the group of the connected student
        $groupMembership = GroupeMembre::where('etudiant_id', $etudiant_id)->first();

        if (!$groupMembership) {
            return response()->json(['message' => 'Student is not in any group.'], 404);
        }

        // Fetch all students in the same group
        $etudiants = GroupeMembre::where('groupe_id', $groupMembership->groupe_id)
            ->with('etudiant.user')
            ->get()
            ->pluck('etudiant');

        return response()->json([
            'success' => true,
            'message' => 'Students in the same group fetched successfully',
            'students' => $etudiants,
        ]);
    }
    public function getGroupsByProfessor($professor_id)
    {
        // Find groups where the professor is a member
        $groupes = Groupe::where('professor_id', $professor_id)->get();

        return response()->json([
            'success' => true,
            'message' => 'Groups fetched successfully',
            'groups' => $groupes,
        ]);
    }

    // Fetch students in the same group as the connected professor
    public function getGroupsAndStudentsByProfessor($professor_id)
{
    // Récupérer tous les groupes du professeur avec les étudiants préchargés
    $groups = Groupe::where('professor_id', $professor_id)
                     ->with('membres.etudiant.user')  // Assurez-vous que la relation 'membres' est correctement définie dans le modèle Groupe
                     ->get();

    // Préparer la réponse avec les données des étudiants regroupées par groupe
    $groupsData = $groups->map(function ($group) {
        $students = $group->membres->pluck('etudiant');
        return [
            'group_id' => $group->id,
            'group_name' => $group->name,
            'students' => $students
        ];
    });

    return response()->json([
        'success' => true,
        'message' => 'Groups and students fetched successfully',
        'groups' => $groupsData
    ]);
}
}
