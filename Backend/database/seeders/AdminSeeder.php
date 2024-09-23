<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'admin')->first();

        Admin::create([
            'nom' => 'Smith',
            'directeur' => 'Jane Doe',
            'site_web' => 'https://adminsite.example.com',
            'user_id' => $user->id,
        ]);
    }
}
