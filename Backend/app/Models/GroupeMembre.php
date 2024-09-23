<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupeMembre extends Model
{
    use HasFactory;
    protected $fillable = [
        'groupe_id',
        'etudiant_id'
    ];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function groupeMessages()
    {
        return $this->hasMany(GroupeMessage::class);
    }
}
