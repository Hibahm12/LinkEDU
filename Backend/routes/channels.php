<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversations.{conversationId}', function ($user, $conversationId) {
    $isUserExist = $user->conversationsAsEtudiant->contains($conversationId) || $user->conversationsAsTeacher->contains($conversationId);
    Log::info($conversationId);
    Log::info('isUserExist', ['user' => $isUserExist]);


    if ($isUserExist) {
        return $user;
    }
});

// Broadcast::channel('groupe-messages.{groupeId}', function ($user, $groupeId) {
//     return optional($user->etudiant)->groupes()->where('groupe_id', $groupeId)->exists();
// });

Broadcast::channel('groupe-messages.{groupeId}', function ($user, $groupeId) {

    $isMember = optional($user->etudiant)->groupes()->where('groupe_id', $groupeId)->exists();
    if ($isMember) {
        return $user;
    }
});

