<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sujet extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'description',
        'annee',
        'professeur_id',
    ];

    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }
    public function professeur()
    {
        return $this->belongsTo(Professeur::class);
    }
    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }
}
