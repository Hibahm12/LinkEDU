<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'etudiant2',
            'email' => 'etudiant2@example.com',
            'role' => 'etudiant',
            'password' => Hash::make('password'), // Hashing the password
        ]);

        // User::create([
        //     'username' => 'admin_user',
        //     'email' => 'admin@example.com',
        //     'role' => 'admin',
        //     'password' => Hash::make('password'), // Hashing the password
        // ]);

        // User::create([
        //     'username' => 'prof_user',
        //     'email' => 'prof@example.com',
        //     'role' => 'professeur',
        //     'password' => Hash::make('password'),
        // ]);

        // User::create([
        //     'username' => 'etudiant_user',
        //     'email' => 'etudiant@example.com',
        //     'role' => 'etudiant',
        //     'password' => Hash::make('password'),
        // ]);
    }
}
