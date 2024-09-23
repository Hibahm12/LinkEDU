<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Etudiant;
use App\Models\User;

class EtudiantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'etudiant')->first();

        Etudiant::create([
            'nom' => 'Doe',
            'prenom' => 'John',
            'filiere' => 'Informatique',
            'classe' => '2ème année',
            'is_moderator' => false,
            'user_id' => $user->id,
        ]);
    }
}
