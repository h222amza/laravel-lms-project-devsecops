<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Cart;
use App\Models\OrderItems;
use App\Models\Enrollment;
class OrderManagementOrderController extends Controller
{
    public function allOrders()
    {
        $orders= Order::with('user')->get();
        return response()->json(['orders'=>$orders], 200);
    }
    public function showAdminOrderDetails($id)
    {
        $order = Order::with('items.course', 'user')->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json(['order' => $order], 200);
    }
    public function refundOrder($id)
    {
        $order=Order::findOrFail($id);
        
        if($order->status !='completed'){
            return response()->json(['message'=>'Only completed orders can be refunded'],400);
        }
        $order->status='refunded';
        $order->save();

        foreach($order->items as $item) {
        Enrollment::where('user_id', $order->user_id)
                ->where('course_id', $item->course_id)
                ->delete();
        }
        return response()->json(['message'=>'Order refunded successfully'],200);
    }
}
