<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    protected $guarded = [];

    // Geçti mi kaldı mı bilgisini boolean yapalım
    protected $casts = [
        'is_passed' => 'boolean',
    ];

    // İlişki 1: Sonuç bir Sınava aittir
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    // İlişki 2: Sonuç bir Öğrenciye (User) aittir
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
