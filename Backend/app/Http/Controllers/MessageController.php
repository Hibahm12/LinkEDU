<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;


class MessageController extends Controller
{
    public function index($groupId)
    {
        $messages = Message::where('groupe_id', $groupId)->orderBy('created_at', 'desc')->get();
        return response()->json($messages);
    }

    public function store(Request $request, $groupId)
    {
        $validated = $request->validate([
            "contenu" => "required",
            "etudiant_id" => "required|exists:etudiants,id"
        ]);
        // should user be member in group
        $isMember = DB::table("etudiant_group")
            ->where("groupe_id", $groupId)
            ->where("etudiant_id", $validated["etudiant_id"])
            ->exists();

        if (!$isMember) {
            return response()->json(["error", "You are not member of this group."], Response::HTTP_FORBIDDEN);
        }


        $message = new Message();
        $message->contenu = $validated["contenu"];
        $message->groupe_id = $groupId;
        $message->etudiant_id = $validated["etudiant_id"];
        $message->save();

        return response()->json($message, Response::HTTP_CREATED);

    }
}
