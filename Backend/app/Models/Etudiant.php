<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;

    protected $fillable = [
        "nom",
        "prenom",
        "filiere",
        "classe",
        'is_moderator',
        "user_id"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function groupes()
    {
        return $this->belongsToMany(Groupe::class, 'groupe_membres', 'etudiant_id', 'groupe_id');
    }
    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }
}
