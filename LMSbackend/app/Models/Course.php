<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['name', 'description', 'category_id', 'price', 'admin_id', 'is_approved'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
    // Kursun sadece 1 tane sınavı olur dedik
    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }
    protected static function booted()
    {
        static::deleting(function ($course) {
            $course->images()->each(function ($image) {
                if (file_exists(public_path($image->image_path))) {
                    unlink(public_path($image->image_path));
                }
                $image->delete();
            });
        });
    }

    
    public function enrolledUsers()
    {
        // pivot table name: enrollments
        return $this->belongsToMany(User::class, 'enrollments')
            ->withTimestamps();
    }
}
