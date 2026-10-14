<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;


class UserProfileController extends Controller
{
    public function getMyCourses(Request $request)
    {
        $user = $request->user();
        $userCourses = Enrollment::where('user_id', $user->id)
            ->with('course.images')
            ->get();

        // ✅ eklendi: her course için owned = true (zaten bunlar kullanıcının)
        $userCourses->each(function ($enrollment) {
            if ($enrollment->course) {
                $enrollment->course->owned = true;
            }
        });

        return response()->json([
            'data' => $userCourses,
        ]);
    }
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->only(['name', 'lastName', 'email']);

        $user->update($data);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!\Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->password = bcrypt($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }
}
