<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sujetextern', function (Blueprint $table) {
            $table->id();
            $table->string('nom_entreprise');
            $table->string('adresse_entreprise');
            $table->string('titre_sujet');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->text('description');
            $table->unsignedBigInteger('etudiant_id');
            $table->foreign('etudiant_id')->references('id')->on('etudiants')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sujetextern');
    }
};
