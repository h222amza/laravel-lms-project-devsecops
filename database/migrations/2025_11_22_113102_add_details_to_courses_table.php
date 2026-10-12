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
        Schema::table('courses', function (Blueprint $table) {
            // 1. Onay Durumu (Varsayılan: 0 yani Onaysız)
        $table->boolean('is_approved')->default(false)->after('name');

        // 2. Sahibi Kim? (Admin ID)
        // 'admin_id' sütunu oluşturur ama 'users' tablosundaki ID ile eşleşir.
        $table->foreignId('admin_id')
              ->after('id') // ID sütunundan hemen sonra ekle
              ->constrained('users') // users tablosuna bağla
              ->onDelete('cascade'); // Admin silinirse kursları da silinsin
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['is_approved', 'admin_id']);
            });
        });
    }
};
