<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItems;
use App\Models\Enrollment;
use Carbon\Carbon;
use App\Models\Course;
class dashboardController extends Controller
{
    public function getSalesAnalytics()
    {
        // 1. GENEL TOPLAM CİRO (Ömürlük Kazanç)
        // Sadece 'completed' olanları topluyoruz. İptal edilenleri sayma!
        $totalRevenue = Order::where('status', 'completed')->sum('total_price');

        // 2. BU AYIN CİROSU (Performans Takibi)
        // whereMonth ve whereYear kullanarak sadece içinde bulunduğumuz ayı seçiyoruz.
        $thisMonthRevenue = Order::where('status', 'completed')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_price');

        // 3. TOPLAM SİPARİŞ SAYISI (Hacim)
        $totalOrders = Order::where('status', 'completed')->count();

        // 4. GRAFİK İÇİN VERİ (Son 7 Günün Satışları)
        // Frontend'de çizgi grafik (Line Chart) yapmak için harika bir veri.
        $graphData = [];

        // Son 7 günü döngüye alıyoruz
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i); // Bugün, dün, önceki gün...

            // O günün toplam satışını bul
            $dailySum = Order::where('status', 'completed')
                ->whereDate('created_at', $date->format('Y-m-d'))
                ->sum('total_price');

            // Listeye ekle: { "date": "25-11", "total": 1500 }
            $graphData[] = [
                'date' => $date->format('d-m'), // Gün-Ay (Örn: 29-11)
                'total' => $dailySum
            ];
        }

        return response()->json([
            'total_revenue'      => $totalRevenue,
            'this_month_revenue' => $thisMonthRevenue,
            'total_orders'       => $totalOrders,
            'graph_data'         => $graphData
        ], 200);
    }

    public function getAnalyticsAdmin(Request $request)
    {
        $adminId = $request->user()->id; // Giriş yapan hocanın ID'si

        // 1. BENİM TOPLAM KAZANCIM (Ciro)
        // OrderItems tablosuna bakıyoruz, çünkü para orada yazıyor.
        // Şart 1: Kursun sahibi ben olmalıyım (course.admin_id)
        // Şart 2: Sipariş tamamlanmış olmalı (order.status = completed)
        $myRevenue = OrderItems::whereHas('course', function ($q) use ($adminId) {
            $q->where('admin_id', $adminId);
        })
            ->whereHas('order', function ($q) {
                $q->where('status', 'completed');
            })
            ->sum('price');

        // 2. TOPLAM ÖĞRENCİ SAYIM (Enrollment)
        // Benim kurslarıma kaç kişi kayıt olmuş?
        $totalStudents = Enrollment::whereHas('course', function ($q) use ($adminId) {
            $q->where('admin_id', $adminId);
        })->count();

        // 3. TOPLAM KURS SAYIM
        $totalCourses = Course::where('admin_id', $adminId)->count();

        // 4. SON SATIŞLARIM (Tablo İçin)
        // Kim, hangi kursumu, ne zaman aldı?
        $recentSales = OrderItems::with(['course:id,title', 'order.user:id,name,email'])
            ->whereHas('course', function ($q) use ($adminId) {
                $q->where('admin_id', $adminId);
            })
            ->whereHas('order', function ($q) {
                $q->where('status', 'completed');
            })
            ->latest()
            ->take(5) // Son 5 satış
            ->get()
            ->map(function ($item) {
                return [
                    'course_title' => $item->course->title,
                    'student_name' => $item->order->user->name,
                    'price'        => $item->price,
                    'date'         => $item->created_at->format('d-m-Y H:i'),
                ];
            });

        // 5. GRAFİK VERİSİ (Son 7 Gün - Sadece Benim Kazancım)
        $graphData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);

            $dailySum = OrderItems::whereHas('course', function ($q) use ($adminId) {
                $q->where('admin_id', $adminId);
            })
                ->whereHas('order', function ($q) {
                    $q->where('status', 'completed');
                })
                ->whereDate('created_at', $date->format('Y-m-d'))
                ->sum('price');

            $graphData[] = [
                'date' => $date->format('d-m'),
                'total' => $dailySum
            ];
        }

        return response()->json([
            'total_revenue'  => $myRevenue,
            'total_students' => $totalStudents,
            'total_courses'  => $totalCourses,
            'recent_sales'   => $recentSales,
            'graph_data'     => $graphData
        ], 200);
    }

}
