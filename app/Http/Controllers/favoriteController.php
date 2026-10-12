<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class favoriteController extends Controller
{
    //favorite
    public function addFavoriteCourse(Request $request, $id)
    {
        $userId = $request->user()->id;
        $data = Favorite::firstOrCreate([
            'user_id' => $userId,
            'course_id' => $id
        ]);
        return response()->json([
            'message' => 'successfully',
            'data' => $data
        ], 201);
    }
    public function getFavoriteCourse(Request $request)
    {
        $userId = $request->user()->id;
        $data = Favorite::where('user_id', $userId)
            ->whereNotNull('course_id') // <-- EKLEMEN GEREKEN BU (Sadece Kurslar)
            ->with('course.images')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'data' => $data
        ], 200);
    }
    public function deleteFavoriteCourse(Request $request, $id)
    {
        $userId = $request->user()->id;
        $deleted = Favorite::where('user_id', $userId)->where('course_id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Favorite not found'], 404);
        }
    }

    //lesson
    public function addFavoriteLesson(Request $request, $id)
    {
        $userId = $request->user()->id;

        $data = Favorite::firstOrCreate([
            'user_id' => $userId,
            'lesson_id' => $id
        ]);

        return response()->json([
            'message' => 'Lesson added to favorites',
            'data' => $data
        ], 201);
    }

    public function getFavoriteLesson(Request $request)
    {
        $userId = $request->user()->id;

        $data = Favorite::where('user_id', $userId)
            ->whereNotNull('lesson_id')
            ->with('lesson.images')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'data' => $data
        ], 200);
    }

    public function deleteFavoriteLesson(Request $request, $id)
    {
        $userId = $request->user()->id;

        $deleted = Favorite::where('user_id', $userId)->where('lesson_id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Favorite not found'], 404);
        }
    }
}
