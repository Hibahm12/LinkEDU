<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SujetExtern extends Model
{
    use HasFactory;

    protected $table = 'sujetextern';

    protected $fillable = [
        'nom_entreprise',
        'adresse_entreprise',
        'titre_sujet',
        'date_debut',
        'date_fin',
        'description',
        'etudiant_id',
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
}
