<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\EnrollmentItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        $user = $request->user();
        //sepette varmi?
        if(Cart::where('user_id', $user->id)->where('course_id', $request->course_id)->exists()) {
            return response()->json(['message' => 'Course already in cart'], 400);
        }
        //sipars edildimi
        if(Enrollment::where('user_id',$user->id)->where('course_id',$request->course_id)->exists()){
            return response()->json(['message' => 'You have already purchased this course'], 400);
        }

        Cart::create([
            'user_id' => $user->id,
            'course_id' => $request->course_id,
        ]);
        $cart=Cart::where('user_id',$user->id)->get();
        return response()->json(['message' => 'Course added to cart successfully','cart'=>$cart], 201);
    }

    public function deleteFromCart(Request $request, $course_id)
    {
        $user = $request->user();

        $cartItem = Cart::where('user_id', $user->id)->where('course_id', $course_id)->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Course not found in cart'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Course removed from cart successfully'], 200);
    }
    public function viewCart(Request $request)
    {
        $user = $request->user();
        $cartItems = Cart::where('user_id', $user->id)->with('course')->get();

        return response()->json(['cart' => $cartItems], 200);
    }
}
