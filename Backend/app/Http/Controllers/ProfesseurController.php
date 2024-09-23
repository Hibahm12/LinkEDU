<?php

namespace App\Http\Controllers;

use App\Imports\ProfesseurImport;
use App\Mail\WelcomeEmail;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Pagination\Paginator;

class ProfesseurController extends Controller
{
    // GET /professeurs
    public function index()
    {
        $professeurs = Professeur::with('user')->paginate(15);


        $paginationData = [
            'total' => $professeurs->total(),
            'per_page' => $professeurs->perPage(),
            'current_page' => $professeurs->currentPage(),
            'last_page' => $professeurs->lastPage(),
            'first_page_url' => $professeurs->url(1),
            'last_page_url' => $professeurs->url($professeurs->lastPage()),
            'next_page_url' => $professeurs->nextPageUrl(),
            'prev_page_url' => $professeurs->previousPageUrl(),
            'path' => $professeurs->path(),
            'from' => $professeurs->firstItem(),
            'to' => $professeurs->lastItem(),
        ];

         $response = [
            'professeurs' => $professeurs->items(),
            'pagination' => $paginationData,
        ];

        return response()->json($response);

        // $professeurs = Professeur::all();
        // return response()->json($professeurs);
    }
    public function show($id)
    {
        $professeur = Professeur::with('user')->find($id);

        if (!empty($professeur)) {
            $formattedProfesseur = [
                "nom" => $professeur->nom,
                "prenom" => $professeur->prenom,
                "matricule" => $professeur->matricule,
                "email" => $professeur->user->email,
            ];
            return response()->json($formattedProfesseur);
        } else {
            return response()->json(["message" => "Professeur not found"], Response::HTTP_NOT_FOUND);
        }
    }

    public function store(Request $request)
    {
        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => bcrypt($request->password),
            "role" => 'professeur',
        ]);
        $user->professeur()->create([
            "nom" => $request->nom,
            "prenom" => $request->prenom,
            "matricule" => $request->matricule,
        ]);
        $user->load('professeur');
        Mail::to($user->email)->send(new WelcomeEmail($user, $request->password));
        return response()->json([
            'status' => 'Request was successful',
            'message' => 'Professeur created successfully',
            'data' => [
                "professeur" => $user,
                "token" => $user->createToken('Api token of ' . $user->name)->plainTextToken
            ]
        ], Response::HTTP_CREATED);
    }


    public function update(Request $request, $id)
    {
        $professeur = Professeur::findOrFail($id);
        $professeur->update([
            "nom" => $request->nom,
            "prenom" => $request->prenom,
            "matricule" => $request->matricule,
        ]);

        $userData = [
            "name" => $request->name,
            "email" => $request->email,
        ];

        if ($request->filled('password')) {
            $userData['password'] = bcrypt($request->password);
        }
        $professeur->user()->update($userData);

        return response()->json(['message' => 'Professeur updated successfully'], Response::HTTP_OK);
    }
    public function destroy($id)
    {
        $professeur = Professeur::findOrFail($id);
        $professeur->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
