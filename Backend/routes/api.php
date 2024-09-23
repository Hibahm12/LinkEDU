<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\GroupeMessageController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserMessageController;
use App\Models\Conversation;
use App\Models\GroupeMessage;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\GotMessage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SujetController;
use App\Http\Controllers\SujetExternController;
use App\Http\Controllers\ProfesseurController;
use App\Http\Controllers\StatistiqueController;

use App\Http\Controllers\MessageProfesseurController;

use App\Jobs\SendMessage;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\GroupeMembreController;





Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/groupe-membres/student/{etudiant_id}', [GroupeMembreController::class, 'getMembershipByStudent'])->middleware('auth:sanctum', 'role:etudiant');

// public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);
Route::get('sujets', [SujetController::class, 'index']);
Route::get('/sujetsexterns', [SujetExternController::class, 'index']); // List all SujetExterns



Route::get('/groupes/{groupe}/professeur', [GroupeController::class, 'professeur']);
Route::get('/groupes/{groupe}/tasks', [TaskController::class, 'index']);
Route::get('/groupes/{groupe}', [GroupeController::class, 'index']);
Route::post('/groupes/{groupe}/tasks', [TaskController::class, 'store']);
Route::put('/tasks/{task}', [TaskController::class, 'update']);
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);


//Route::post('/register', [AuthController::class, 'register']);


// protected Routes
Route::group(['middleware' => ['auth:sanctum', 'role:admin']], function () {

    // etudiants
    Route::get('/etudiants', [EtudiantController::class, 'index'])->name('etudiants.index');
    Route::get('/etudiants/{id}', [EtudiantController::class, 'show']);
    Route::post('/etudiants', [EtudiantController::class, 'store'])->name('etudiants.store');
    Route::put('/etudiants/{id}', [EtudiantController::class, 'update'])->name('etudaints.update');
    Route::post('/etudiants/etudiantsxls', [EtudiantController::class, 'importEtudiantsXls']);
    // logout
    //Route::post('/logout', [AuthController::class, 'logout']);
});

Route::group(['middleware' => ['auth:sanctum', 'role:admin']], function () {

    // professeurs
    Route::get('/professeurs', [ProfesseurController::class, 'index'])->name('professeurs.index');
    Route::get('/professeurs/{id}', [ProfesseurController::class, 'show']);
    Route::post('/professeurs', [ProfesseurController::class, 'store'])->name('professeurs.store');
    Route::post('/professeurs/{id}', [ProfesseurController::class, 'update'])->name('professeurs.update');
    Route::post('/professeurs/professeursxls', [ProfesseurController::class, 'importProfesseurXls']);
    Route::delete('professeurs/{id}', [ProfesseurController::class, 'destroy']);


    // logout
    Route::post('/logout', [AuthController::class, 'logout']);


});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/sujetsexterns/{id}', [SujetExternController::class, 'update']); // Update a specific SujetExtern
    Route::post('/sujetsexterns', [SujetExternController::class, 'store']); // Create a new SujetExtern
    Route::get('/sujetsexterns/{id}', [SujetExternController::class, 'show']); // Display a specific SujetExtern
    Route::delete('/sujetsexterns/{id}', [SujetExternController::class, 'destroy']); // Delete a specific SujetExtern
});
Route::group(['middleware' => ['auth:sanctum', 'role:etudiant,admin,profeeseur']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/test', [EtudiantController::class, 'test']);
});

Route::get('/groups/{groupId}/messages', [MessageController::class, 'index']);
Route::post('/groups/{groupId}/message', [MessageController::class, 'store']);


Route::get('/conversations/{id}/messages', [UserMessageController::class, 'messages']);
Route::post('/conversations/{id}/message', [UserMessageController::class, 'message']);

Route::get('/statistics/total', [StatistiqueController::class, 'total']);

Route::get('/groupe-messages/{id}/messages', [GroupeMessageController::class, 'messages']);
Route::post('/groupe-messages/{id}/message', [GroupeMessageController::class, 'message']);

Route::post('/conversations', [ConversationController::class, 'store']);





Route::post('/groupe-membres', [GroupeMembreController::class, 'store']);
Route::get('/groupe-membres/{groupe_id}', [GroupeMembreController::class, 'index']);
Route::put('/groupe-membres/{id}', [GroupeMembreController::class, 'update']);
Route::delete('/groupe-membres/{id}', [GroupeMembreController::class, 'destroy']);
Route::group(['middleware' => ['auth:sanctum', 'role:admin']], function () {
    // Adding a new route to check if a student is in any group


    Route::post('sujets', [SujetController::class, 'store']);
    Route::get('sujets/{id}', [SujetController::class, 'show']);
    Route::put('sujets/{id}', [SujetController::class, 'update']);
    Route::delete('sujets/{id}', [SujetController::class, 'destroy']);
});
Route::get('/demandes', [DemandeController::class, 'index'])->name('demandes.index');
Route::post('/demandes', [DemandeController::class, 'store'])->name('demandes.store');
Route::get('/demandes/{demande}', [DemandeController::class, 'show'])->name('demandes.show');
Route::delete('/demandes/{demande}', [DemandeController::class, 'destroy'])->name('demandes.destroy');
Route::post('accept/{demande_id}', [DemandeController::class, 'accept']);
Route::post('refuse/{demande_id}', [DemandeController::class, 'refuse']);

Route::get('/groupes/members/{etudiant_id}', [GroupeMembreController::class, 'getStudentsInSameGroup']);
Route::get('/professor/groups/{professor_id}', [GroupeMembreController::class, 'getGroupsByProfessor']);
Route::get('/professor/{professor_id}/students', 'App\Http\Controllers\GroupeMembreController@getStudentsInGroupByProfessor');

