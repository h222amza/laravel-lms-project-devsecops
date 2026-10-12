<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\WatchedLesson;

class WatchedLessonController extends Controller
{
    public function myCourses(Request $request)
    {
        $user = $request->user();
        $userCourses = Enrollment::where('user_id', $user->id)->with('course.images')->latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $userCourses
        ], 200);
    }

    public function getCourseContent(Request $request, $id)
    {
        $userId = $request->user()->id;

        // guvenlik amacli :
        Enrollment::where('user_id', $userId)
            ->where('course_id', $id)
            ->firstOrFail(); // ✅ user kursa kayıtlı değilse 404/403

        $course = Course::with(['lessons' => function ($q) {
            $q->orderBy('sort_order')->with('items');
        }, 'quiz'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $course
        ], 200);
    }


    public function startLesson(Request $request, $id)
    {
        $user = $request->user();
        $lesson = Lesson::with('items')->findOrFail($id);
        $hasAccess = Enrollment::where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->exists();
        if (!$hasAccess) {
            return response()->json(['message' => 'You do not have permission to view this lesson'], 403);
        }
        $watched = WatchedLesson::firstOrCreate([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'course_id' => $lesson->course_id,
        ]);
        //burda kullanci onceden izledigi videoyu ama tekrar acti diyelim tekrar kaydetmek yerine sadee zamani guncelleriz okadar
        $watched->touch();
        return response()->json([
            'status' => 'success',
            'data' => $lesson
        ], 200);
    }
    public function getHistory(Request $request)
    {
        $userId = $request->user()->id;
        $history = WatchedLesson::where('user_id', $userId)->orderBy('updated_at', 'desc')->with('lesson.images')->take(20)->get();
        return response()->json([
            'message' => 'success',
            'history' => $history
        ], 200);
    }
}
