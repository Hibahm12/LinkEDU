<?php

namespace App\Http\Controllers;

use App\Imports\EtudiantImport;
use App\Mail\WelcomeEmail;
use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Pagination\Paginator;



class EtudiantController extends Controller
{
    public function index()
    {
        $etudiants = Etudiant::with('user')->paginate(10);

        $paginationData = [
            'total' => $etudiants->total(),
            'per_page' => $etudiants->perPage(),
            'current_page' => $etudiants->currentPage(),
            'last_page' => $etudiants->lastPage(),
            'first_page_url' => $etudiants->url(1),
            'last_page_url' => $etudiants->url($etudiants->lastPage()),
            'next_page_url' => $etudiants->nextPageUrl(),
            'prev_page_url' => $etudiants->previousPageUrl(),
            'path' => $etudiants->path(),
            'from' => $etudiants->firstItem(),
            'to' => $etudiants->lastItem(),
        ];
        $response = [
            'etudiants' => $etudiants->items(),
            'pagination' => $paginationData,
        ];

        return response()->json($response);


        // $etudiants = Etudiant::all();
        // return response()->json($etudiants);
    }



    public function show($id)
    {
        $etudiant = Etudiant::with('user')->find($id);

        if (!empty($etudiant)) {

            $formatedEtudiant = [
                "nom" => $etudiant->nom,
                "prenom" => $etudiant->prenom,
                "filiere" => $etudiant->filiere,
                "classe" => $etudiant->classe,
                "username" => $etudiant->user->username,
                "email" => $etudiant->user->email,
            ];
            return response()->json($formatedEtudiant);
        } else {
            return response()->json(["message" => "Etudiant not found"], Response::HTTP_NOT_FOUND);
        }

    }


    public function store(Request $request)
    {


        $user = User::create([
            "username" => $request->username,
            "email" => $request->email,
            "password" => bcrypt($request->password),
            "role" => 'etudiant',
        ]);

        $user->etudiant()->create([
            "nom" => $request->nom,
            "prenom" => $request->prenom,
            "filiere" => $request->filiere,
            "classe" => $request->classe,
        ]);


        $user->load('etudiant');

        // send email to student to login
        Mail::to($user->email)->send(new WelcomeEmail($user, $request->password));



        return response()->json([
            'status' => 'Request was succesful',
            'message' => 'Etudiant created successfully',
            'data' => [
                "etudiant" => $user,
                "token" => $user->createToken('Api token of ' . $user->username)->plainTextToken
            ]
        ], Response::HTTP_CREATED);
    }
    public function update(Request $request, $id)
    {
        $etudiant = Etudiant::findOrFail($id);
        $etudiant->update([
            "nom" => $request->nom,
            "prenom" => $request->prenom,
            "filiere" => $request->filiere,
            "classe" => $request->classe,
        ]);


        $userData = [
            "username" => $request->username,
            "email" => $request->email,
        ];

        if ($request->filled('password')) {
            $userData['password'] = bcrypt($request->password);
        }
        $etudiant->user()->update($userData);

        return response()->json(['message' => 'Etudiant updated successfully'], Response::HTTP_OK);

    }
    public function destroy($id)
    {
        $etudiant = Etudiant::findOrFail($id);
        $etudiant->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
