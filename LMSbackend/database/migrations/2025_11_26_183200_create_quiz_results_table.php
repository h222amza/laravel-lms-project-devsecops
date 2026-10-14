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
        Schema::create('quiz_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            
            $table->integer('score'); // Aldığı puan (Örn: 85)
            $table->boolean('is_passed'); // Geçti mi? (Geçme notuna göre hesaplanacak)
            $table->integer('correct_answers'); // Kaç doğrusu var?
            $table->integer('wrong_answers'); // Kaç yanlışı var?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_results');
    }
};
