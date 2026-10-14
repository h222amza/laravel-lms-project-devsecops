<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Testing\Fluent\Concerns\Has;

class Category extends Model
{
    protected $fillable = ['name'];

    public function courses()
    {
        return $this->hasMany(Course::class,'category_id');
    }

    public function Images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    protected static function booted()
{
    static::deleting(function ($category) {
        // Kategoriye bağlı TÜM resimleri bul
        $category->images()->each(function($image) {
            
            // 2. Veritabanındaki satırı sil
            $image->delete();
        });
    });
}
}
