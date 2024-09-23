<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'etudiant_id' => 'required|exists:users,id',
            'professeur_id' => 'required|exists:users,id'
        ]);

        // Check if the combination already exists
        $conversation = Conversation::where('etudiant_id', $request->etudiant_id)
            ->where('professeur_id', $request->professeur_id)
            ->first();

        if ($conversation) {
            return response()->json(['message' => 'This conversation already exists.', 'conversation' => $conversation], 200);
        }

        // Create a new conversation
        $conversation = Conversation::create($validated);
        return response()->json(['message' => 'Conversation created successfully.', 'conversation' => $conversation], 201);
    }
}
