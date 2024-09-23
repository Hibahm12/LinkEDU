<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithMappedCells;



class EtudiantImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $rows
     */





    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $user = User::create([
                "name" => $row['username'],
                "email" => $row['test'],
                "password" => bcrypt($row['password']),

            ]);
            $user->etudiant()->create([
                "nom" => $row['nom'],
                "prenom" => $row['prenom'],
                "filiere" => $row['filiere'],
                "classe" => $row['classe'],
            ]);
        }
    }
}
