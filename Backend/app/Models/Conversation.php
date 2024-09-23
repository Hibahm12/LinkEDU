<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;
    protected $fillable = ['etudiant_id', 'professeur_id'];

    public function userMessage()
    {
        return $this->hasMany(UserMessage::class);
    }
}
