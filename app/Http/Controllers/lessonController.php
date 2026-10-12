<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Lesson;
use App\Models\LessonItem;
use Illuminate\Http\Request;

class lessonController extends Controller
{
    public function create(Request $request, $course_id)
    {
        // 1. VALIDASYON (Dosya türlerini ve boyutlarını belirledik)
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:video,document',
            'image' => 'nullable|image|max:2048', // 2MB
            // VIDEO İÇİN: mp4, mov, ogg, qt formatları. Max: 50MB (51200 KB)
            'video_path' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:51200',
            // DOKÜMAN İÇİN: pdf, word, excel. Max: 10MB (10240 KB)
            'document_path' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:10240',
        ]);
        // 2. Lesson (Bölüm) Oluşturma
        $lesson = Lesson::create([
            'course_id' => $course_id,
            'name' => $request->name,
            'sort_order' => Lesson::where('course_id', $course_id)->count() + 1,
        ]);
        // --- DOSYA YÜKLEME İŞLEMLERİ ---
        // A. VIDEO YÜKLEME
        $videoDbPath = null; // Varsayılan boş
        if ($request->hasFile('video_path')) {
            $video = $request->file('video_path');
            $videoName = time() . '_vid_' . $video->getClientOriginalName();
            $videoUploadPath = public_path('lessons/videos'); // public/lessons/videos klasörü

            $video->move($videoUploadPath, $videoName);
            $videoDbPath = 'lessons/videos/' . $videoName;
        }
        // B. DOKÜMAN YÜKLEME
        $documentDbPath = null; // Varsayılan boş
        if ($request->hasFile('document_path')) {
            $doc = $request->file('document_path');
            $docName = time() . '_doc_' . $doc->getClientOriginalName();
            $docUploadPath = public_path('lessons/documents'); // public/lessons/documents klasörü

            if (!file_exists($docUploadPath)) {
                mkdir($docUploadPath, 0755, true);
            }

            $doc->move($docUploadPath, $docName);
            $documentDbPath = 'lessons/documents/' . $docName;
        }
        // 3. LessonItem (İçerik) Oluşturma
        // Veritabanına dosya yollarını kaydediyoruz
        LessonItem::create([
            'lesson_id' => $lesson->id,
            'description' => $request->description,
            'video_path' => $videoDbPath,       // Yüklenen videonun yolu
            'document_path' => $documentDbPath, // Yüklenen dokümanın yolu
            'type' => $request->type,
        ]);
        // 4. Resim Yükleme (Kapak Resmi)
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_img_' . $file->getClientOriginalName();
            $uploadPath = public_path('lessons');


            $file->move($uploadPath, $filename);

            $lesson->images()->create([
                'image_path' => 'lessons/' . $filename
            ]);
        }
        return response()->json([
            'message' => 'Lesson and files uploaded successfully',
            'lesson' => $lesson->load('items', 'images')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // 1. DERSİ VE İÇERİĞİNİ BUL
        // LessonItem'ı da çekiyoruz ki güncelleme yapabilelim
        $lesson = Lesson::with('items', 'images')->findOrFail($id);

        // Genelde bir dersin bir içeriği olur varsayımıyla ilkini alıyoruz
        $lessonItem = $lesson->items()->first();

        // 2. VALİDASYON (Güncellemede 'nullable' kullanmak mantıklıdır)
        $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|in:video,document',
            'image' => 'nullable|image|max:2048',
            'video_path' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:51200',
            'document_path' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        // 3. LESSON TABLOSUNU GÜNCELLE (Sadece Name)
        if ($request->has('name')) {
            $lesson->update(['name' => $request->name]);
        }

        // 4. LESSON_ITEMS (İÇERİK) GÜNCELLEME
        if ($lessonItem) {

            // A. VİDEO GÜNCELLEME
            if ($request->hasFile('video_path')) {
                // Eski videoyu sil (Sunucuda yer kaplamasın)
                if ($lessonItem->video_path && file_exists(public_path($lessonItem->video_path))) {
                    unlink(public_path($lessonItem->video_path));
                }

                // Yeni videoyu yükle
                $video = $request->file('video_path');
                $videoName = time() . '_vid_' . $video->getClientOriginalName();
                $video->move(public_path('lessons/videos'), $videoName);

                // Veritabanını güncelle
                $lessonItem->video_path = 'lessons/videos/' . $videoName;
            }

            // B. DOKÜMAN GÜNCELLEME
            if ($request->hasFile('document_path')) {
                // Eski dokümanı sil
                if ($lessonItem->document_path && file_exists(public_path($lessonItem->document_path))) {
                    unlink(public_path($lessonItem->document_path));
                }

                // Yeni dokümanı yükle
                $doc = $request->file('document_path');
                $docName = time() . '_doc_' . $doc->getClientOriginalName();
                $doc->move(public_path('lessons/documents'), $docName);

                // Veritabanını güncelle
                $lessonItem->document_path = 'lessons/documents/' . $docName;
            }

            // Diğer text alanlarını güncelle
            if ($request->has('description')) $lessonItem->description = $request->description;
            if ($request->has('type')) $lessonItem->type = $request->type;

            $lessonItem->save();
        }

        // 5. RESİM (IMAGE) GÜNCELLEME
        if ($request->hasFile('image')) {

            // Eski resmi bul
            $oldImage = $lesson->images()->first();

            // Eski resim varsa sil (Model Event'ini yazdığımız için dosyayı otomatik silecek)
            if ($oldImage) {
                $oldImage->delete();
            }

            // Yeni resmi yükle
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $uploadPath = public_path('lessons/images');

            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            $file->move($uploadPath, $filename);

            // Yeni kaydı oluştur
            $lesson->images()->create([
                'image_path' => 'lessons/images/' . $filename
            ]);
        }

        return response()->json([
            'message' => 'Lesson updated successfully',
            'lesson' => $lesson->load('items', 'images')
        ], 200);
    }

    public function delete($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json([
            'message' => 'Lesson deleted successfully'
        ], 200);
    }

    public function index($id)
    {
        $lessons = Lesson::where('course_id', $id)->with('items', 'images')->get();
        return response()->json(['lessons' => $lessons], 200);
    }

    public function show($id)
    {
        $lesson = Lesson::with('items', 'images')->findOrFail($id);
        return response()->json(['lesson' => $lesson], 200);
    }
}
