<?php

namespace App\Http\Controllers;

use App\Models\MessageProfesseur;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use App\Jobs\SendMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserMessageController extends Controller
{


    public function messages($conversationId): JsonResponse
    {

        $messages = UserMessage::with('user')
            ->where('conversation_id', $conversationId)
            ->get()
            ->append('time');

        return response()->json($messages);
    }




    public function message(Request $request, $conversationId): JsonResponse
    {
        $message = UserMessage::create([
            'conversation_id' => $conversationId,
            'user_id' => $request->user_id,
            'contenu' => $request->contenu,
        ]);
        broadcast(new \App\Events\UserMessageEvent($message))->toOthers();

        return response()->json($message);
    }
}
