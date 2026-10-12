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
        Schema::create('lesson_items', function (Blueprint $table) {
            $table->id();
            // Hangi derse/bölüme ait?
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            
            $table->text('description')->nullable(); // Açıklama
            
            // Video Dosya Yolu (Nullable)
            $table->string('video_path')->nullable();
            
            // Doküman/PDF Dosya Yolu (Nullable)
            $table->string('document_path')->nullable();
            
            // İçerik Tipi (Video mu, Metin mi? Frontend'de işine yarar)
            // 'video', 'document', 'text' gibi değerler alabilir.
            $table->string('type')->default('video');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_items');
    }
};
