<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller
{
    public function loginUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
        $user=User::where('email',$request->email)->first();

        if(!$user || !Hash::check($request->password,$user->password)){
            return response()->json(['message'=>'Invalid credentials'],401);
        }

        $token=$user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'message'=>'Login successful',
            'token'=>$token,
            'role'=>$user->role,
        ]);
    }
    public function loginAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
        $user=User::where('email',$request->email)->first();
        
        if(!$user || !Hash::check($request->password,$user->password) || $user->role === 'user'){
            return response()->json(['message'=>'Invalid admin credentials'],401);
        }

        $token=$user->createToken('auth_token')->plainTextToken;

        return response()->json([[
            'message'=>'Admin login successful',
            'token'=>$token,
            'role'=>$user->role,
        ]]);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message'=>'Logged out successfully'
        ]);
    }
}
