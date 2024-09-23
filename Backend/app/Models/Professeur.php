<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professeur extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'prenom',
        'matricule',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }
    public function sujets()
    {
        return $this->hasMany(Sujet::class);
    }
    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }
}
