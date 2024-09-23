<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Professeur;
use App\Models\User;

class ProfesseurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'professeur')->first();

        Professeur::create([
            'nom' => 'Johnson',
            'prenom' => 'Mike',
            'matricule' => 'P123456',
            'user_id' => $user->id,
        ]);
    }
}
