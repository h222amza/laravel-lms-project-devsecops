<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */

    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'name',
        'lastName', // Tablonda var
        'role',     // Tablonda var
        'email',
        'password',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function hasRole($role)
    {
        return $this->role === $role;
    }
    // Öğrencinin çözdüğü sınav sonuçları
    public function quizResults()
    {
        return $this->hasMany(QuizResult::class);
    }
    //course icin
    public function courses()
    {
        return $this->hasMany(Course::class, 'admin_id');
    }

    public function enrolledCourses()
    {
        // pivot table name: enrollments
        return $this->belongsToMany(Course::class, 'enrollments')
            ->withTimestamps();
    }


    public function orders()
    {
        return $this->hasMany(\App\Models\Order::class, 'user_id'); // ✅ şart
    }

    public function purchasedCourseIds(): array
    {
        return Enrollment::where('user_id', $this->id)
            ->pluck('course_id')
            ->toArray();
    }
    public function deleteWithCourses(): bool
    {
        // Önce adminin kurslarını sil
        $this->courses()->each(function ($course) {
            $course->delete(); // Course modelinde zaten ilişkili verileri vs. hallediyorsan oradan devam eder
        });

        // Sonra admini sil
        return $this->delete();
    }
}
