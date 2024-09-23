<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'sujet_id',
        'professeur_id',
    ];

    public function sujet()
    {
        return $this->belongsTo(Sujet::class);
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class);
    }

    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class, 'groupe_membres', 'groupe_id', 'etudiant_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
