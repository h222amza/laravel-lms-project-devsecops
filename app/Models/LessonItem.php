<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonItem extends Model
{
    protected $fillable = [
        'lesson_id', 
        'description', 
        'video_path', 
        'document_path',
        'type'
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
