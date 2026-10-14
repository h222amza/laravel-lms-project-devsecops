<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Image;
use Illuminate\Support\Facades\File; // Dosya silme işlemi için bunu tepeye ekle
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $category = Category::create([
            'name' => $request->name,
        ]);
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $uploadPath = public_path('categories');
            // Resmi oraya taşı
            $file->move($uploadPath, $filename);

            $category->images()->create([
                'image_path' => 'categories/' . $filename
            ]);
        }

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        // 1. İsim Güncelleme
        if ($request->has('name')) {
            $category->name = $request->name;
        }

        $category->save();

        // 2. Resim Güncelleme İşlemi
        if ($request->hasFile('image')) {

            // A. ESKİ RESMİ SİLME OPERASYONU
            $oldImage = $category->images()->first();
            // 2. Veritabanındaki kaydı sil
            $oldImage->delete();

            // B. YENİ RESMİ YÜKLEME
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $uploadPath = public_path('categories');


            $file->move($uploadPath, $filename);

            // Veritabanına yeni kaydı ekle
            $category->images()->create([
                'image_path' => 'categories/' . $filename
            ]);
        }

        Cache::forget('categories_all');

        // Güncel veriyi resimle birlikte döndür
        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category->load('images'),
        ], 200);
    }
    public function index()
    {
        $categories = Category::with('Images')->get();
        return response()->json($categories);
    }

    public function indexForGuests(Request $request)
    {
        $query = Category::with([
            'images',
            'courses' => function ($q) {
                $q->where('is_approved', 1)->with('images');
            },
        ]);

        // 🔍 Search varsa cache kullanmayalım
        if ($request->has('search') && $request->search !== null) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('courses', function ($sub) use ($searchTerm) {
                        $sub->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });

            $data = $query->get();

            return response()->json(['data' => $data], 200);
        }

        // 🔁 Search YOKSA – tüm kategorileri cache’le
        $data = Cache::remember('categories_all', 7200, function () use ($query) {
            return $query->get();
        });

        return response()->json(['data' => $data], 200);
    }

    public function show($id)
    {
        $category = Category::with(['courses' => function ($query) {
            $query->where('is_approved', 1);
        }, 'courses.images'])->find($id);
        // Eğer ID bulunamazsa patlamasın, 404 versin
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category);
    }
    public function delete($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();
        Cache::forget('categories_all');

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
