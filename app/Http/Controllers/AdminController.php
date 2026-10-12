<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        $courses = Course::with('images', 'enrolledUsers', 'admin')->get();

        return response()->json(['data' => $courses]);
    }
    public function isProvided($id)
    {
        $course = Course::findOrFail($id);

        $course->is_approved = 1;
        $course->save();

        return response()->json([
            'message' => 'Course approval status updated successfully',
            'course'  => $course,
        ], 200);
    }
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $admin = User::where('id', $user->id)->get();
        $adminCourses = Course::where('admin_id', $user->id)->with('images')->get();
        return response()->json(['data' => $adminCourses, 'admin' => $admin]);
    }
    public function getCategory()
    {
        $categ = Category::get();
        return response()->json(['data' => $categ]);
    }

    public function showAdmins()
    {
        $admins = User::where('role', 'admin')->get();
        return response()->json(['data' => $admins]);
    }
    public function deleteAdmins($id)
    {
        $admin = User::findOrFail($id);

        if ($admin->role !== 'admin') {
            return response()->json([
                'message' => 'This user is not an admin.'
            ], 400);
        }
        $admin->deleteWithCourses();

        return response()->json([
            'message' => 'Admin and all his courses have been deleted successfully.'
        ]);
    }
}
