<?php

namespace App\Http\Controllers;

use App\Models\GroupeMembre;
use App\Models\GroupeMessage;
use Illuminate\Http\JsonResponse;
use App\Events\GroupeMessageEvent;

use Illuminate\Http\Request;

class GroupeMessageController extends Controller
{
    public function messages($groupId): JsonResponse
    {

        $messages = GroupeMessage::with('user')
            ->where('groupe_id', $groupId)
            ->get()
            ->append('time');

        return response()->json($messages);
    }




    public function message(Request $request, $groupeId): JsonResponse
    {
        $message = GroupeMessage::create([
            'groupe_id' => $groupeId,
            'user_id' => $request->user_id,
            'contenu' => $request->contenu,
        ]);
        broadcast(new GroupeMessageEvent($message))->toOthers();

        return response()->json($message);
    }
}
