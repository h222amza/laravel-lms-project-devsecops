<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cache;

class CacheHelper
{
    // Tüm kurs cache'lerini temizle
    public static function clearCourseCache($courseId = null)
    {
        Cache::forget('courses_all');

        if ($courseId) {
            Cache::forget("course_guest_{$courseId}");
        }
    }

    // Kategori cache'lerini temizle
    public static function clearCategoryCache()
    {
        Cache::forget('categories_all');
    }
}
