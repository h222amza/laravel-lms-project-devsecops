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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name');
            $table->string('logo_path')->nullable();
            $table->string('favicon_path')->nullable();
            
            // --- HEADER (Üst Kısım) ---
            $table->string('header_text')->nullable();      // Log yanındaki slogan vs.
            $table->string('header_button_text')->nullable(); // "Hemen Katıl" butonu yazısı
            $table->string('header_button_link')->nullable(); // Buton nereye gidecek?
            
            // --- İLETİŞİM BİLGİLERİ (Footer için) ---
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->text('google_maps_embed_code')->nullable(); // Harita iframe kodu
            
            // --- SOSYAL MEDYA (Varsa linkleri, yoksa null) ---
            $table->string('facebook_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('youtube_url')->nullable();
            
            // --- SEO (Google için) ---
            $table->text('meta_description')->nullable(); 
            $table->string('meta_keywords')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
