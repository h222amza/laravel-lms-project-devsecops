<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Cache;

class CoursesController extends Controller
{
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|integer|exists:categories,id',
            'price' => 'required|numeric|min:0',
            // admin_id'yi frontend'ten beklemiyoruz artık
            'is_approved' => 'sometimes|boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        // logged-in admin'den al
        $validatedData['admin_id'] = $request->user()->id;

        // default 0
        $validatedData['is_approved'] = $validatedData['is_approved'] ?? 0;

        $course = Course::create($validatedData);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $uploadPath = public_path('courses');

            $file->move($uploadPath, $filename);
            $course->images()->create([
                'image_path' => 'courses/' . $filename
            ]);
        }

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'price' => 'sometimes|required|numeric|min:0',
            'admin_id' => 'required|integer|exists:users,id',
            'is_approved' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
        ]);
        $course->update($validatedData);

        if ($request->hasFile('image')) {

            // A. ESKİ RESMİ SİLME OPERASYONU
            $oldImage = $course->images()->first();
            // 2. Veritabanındaki kaydı sil
            $oldImage->delete();

            // B. YENİ RESMİ YÜKLEME
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $uploadPath = public_path('categories');


            $file->move($uploadPath, $filename);

            // Veritabanına yeni kaydı ekle
            $course->images()->create([
                'image_path' => 'categories/' . $filename
            ]);
        }

        Cache::forget("course_guest_{$id}");
        Cache::forget('courses_all');
        return response()->json(['message' => 'Course updated successfully', 'course' => $course], 200);
    }
    public function show($id)
    {
        $course = Course::with('category', 'admin', 'images')->find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }
        return response()->json(['course' => $course], 200);
    }
    public function myCourses(Request $request)
    {
        $adminId = $request->user()->id;
        $courses = Course::where('admin_id', $adminId)->with('category', 'admin', 'images')->get();
        return response()->json(['courses' => $courses], 200);
    }
    public function index()
    {
        $courses = Cache::remember('courses_all', 3600, function () {
            return Course::with(['category', 'admin', 'images'])
                ->where('is_approved', 1)
                ->get();
        });
        // $courses = Course::where('is_approved',1)->with('category', 'admin', 'images')->get();
        return response()->json(['courses' => $courses], 200);
    }

    //
    public function showForGuests(Request $request, $id)
    {
        $course = Cache::remember("course_guest_{$id}", 3600, function () use ($id) {
            return Course::with(['category', 'admin', 'lessons.images'])
                ->where('id', $id)
                ->where('is_approved', 1)
                ->firstOrFail();
        });

        // ✅ eklendi: kullanıcının bu kursu satın alıp almadığını hesapla
        $owned = false;

        if ($request->user()) { // token geldiyse
            $userCourseIds = $request->user()->purchasedCourseIds(); // ✅ eklendi
            $owned = in_array($course->id, $userCourseIds);          // ✅ eklendi
        }

        $course->owned = $owned; // ✅ front için flag

        return response()->json($course, 200); // ✅ düzeltildi: tek course objesi dönüyoruz
    }


    public function delete($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }
        $course->delete();
        Cache::forget("course_guest_{$id}");
        Cache::forget('courses_all');
        return response()->json(['message' => 'Course deleted successfully'], 200);
    }

    public function getPopularCourses(Request $request) // ✅ Request eklendi
    {
        $courses = Course::where('is_approved', 1)->with(['images'])
            ->withCount('enrolledUsers')          // kaç kişi kayıt olmuş?
            ->orderByDesc('enrolled_users_count') // en çok enrolledUser alan en üstte
            ->take(6)
            ->get();

        // ✅ eklendi: login ise kullanıcının sahip olduğu kurs id'leri
        $userCourseIds = [];
        if ($request->user()) {
            $userCourseIds = $request->user()->purchasedCourseIds();
        }

        // ✅ eklendi: her kursa owned flag'i
        $courses->each(function ($course) use ($userCourseIds) {
            $course->owned = in_array($course->id, $userCourseIds);
        });

        return response()->json([
            'data' => $courses
        ]);
    }


    public function getNewCourses(Request $request) // ✅ Request eklendi
    {
        $courses = Course::where('is_approved', 1)
            ->with(['images'])
            ->orderByDesc('created_at') // en son eklenen en üstte
            ->take(6)                   // 6 tane yeni kurs
            ->get();

        // ✅ eklendi: login ise kullanıcının kurs id'leri
        $userCourseIds = [];
        if ($request->user()) {
            $userCourseIds = $request->user()->purchasedCourseIds();
        }

        // ✅ eklendi: owned flag
        $courses->each(function ($course) use ($userCourseIds) {
            $course->owned = in_array($course->id, $userCourseIds);
        });

        return response()->json([
            'data' => $courses,
        ]);
    }
}
