<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItems;
use App\Models\Cart;
use Illuminate\Http\Request;
use App\Models\Enrollment;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Mail;


class OrderController extends Controller
{
    public function placeOrder(Request $request)
    {
        $user = $request->user();
        $cartItems = Cart::where('user_id', $user->id)->with('course')->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $totalPrice = $cartItems->sum(function ($item) {
            return $item->course->price;
        });
        $order = Order::create([
            'user_id' => $user->id,
            'order_code' => uniqid('order_'),
            'total_price' => $totalPrice,
            'status' => 'completed',
            'payment_method' => $request->input('payment_method'),
        ]);

        foreach ($cartItems as $item) {
            OrderItems::create([
                'order_id' => $order->id,
                'course_id' => $item->course_id,
                'price' => $item->course->price,
            ]);
            Enrollment::firstOrCreate([
                'user_id' => $user->id,
                'course_id' => $item->course_id
            ]);
        }
        Cart::where('user_id', $user->id)->delete();



        return response()->json(['message' => 'Order placed successfully', 'order_id' => $order->id], 201);
    }

    public  function viewOrders(Request $request)
    {
        $user = $request->user();
        $orders = Order::where('user_id', $user->id)->with('items.course')->get();

        return response()->json(['orders' => $orders], 200);
    }
}
