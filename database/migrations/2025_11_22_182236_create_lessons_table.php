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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');            
            $table->string('name'); // Dersin adı (Örn: Bölüm 1: Giriş)
            // Eğer ders bazlı fiyatlandırma yapacaksan (Genelde kurs satılır ama sen istedin)
            $table->decimal('price', 10, 2)->default(0); // 100.50 gibi            
            // Sıralama için (Hangi ders önce gelecek?)
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
