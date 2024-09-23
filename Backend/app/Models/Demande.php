<?php

// app/Models/Demande.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $fillable = [
        'cv',
        'message',
        'professeur_id',
        'etudiant_id',
        'sujet_id',
    ];

    public function professeur()
    {
        return $this->belongsTo(Professeur::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function sujet()
    {
        return $this->belongsTo(Sujet::class);
    }
}

