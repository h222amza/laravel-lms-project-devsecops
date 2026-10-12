<?php

namespace App\Models;
use App\Models\Course;
use App\Models\LessonItem;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['course_id', 'name', 'price', 'sort_order'];

    // Ders bir kursa aittir
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // Dersin içerikleri vardır
    public function items()
    {
        return $this->hasMany(LessonItem::class);
    }
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
    protected static function booted()
    {
        static::deleting(function ($lesson) {
            
            // 1. DERSİN KENDİ KAPAK RESMİNİ SİL (Senin yazdığın kısım)
            $lesson->images()->each(function($image) {
                if (file_exists(public_path($image->image_path))) {
                    unlink(public_path($image->image_path));
                }
                $image->delete();
            });

            // 2. DERSE AİT İÇERİKLERİ (ITEMS) TEK TEK SİL
            // each() kullanıyoruz ki LessonItem modelindeki 'deleting' eventi tetiklensin.
            $lesson->items()->each(function($item) {
                $item->delete(); 
            });
        });
    }
}
