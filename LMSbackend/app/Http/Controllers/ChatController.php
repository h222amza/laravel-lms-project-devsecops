<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Mail\Attachment;

use function Symfony\Component\Clock\now;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message'     => 'nullable|string',
            'attachment'  => 'nullable|image|max:2048' // Opsiyonel Resim
        ]);

        $senderId = $request->user()->id;
        $receiverId = $request->receiver_id;

        //bu sekilde iki kisi arasinda iki mesajlasmayi yasaklariz mesela 
        //birnci mesajlasma id:1 id:4  
        //ikincisi          id:4 id:1  buda buyuk hataya yol acar onu onlemek icin yapariz
        $u1 = min($senderId, $receiverId);
        $u2 = max($senderId, $receiverId);

        $conversation = Conversation::firstOrCreate([
            'user_one' => $u1,
            'user_two' => $u2
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = 'chat_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('chat'), $filename);
            $attachmentPath = 'chat/' . $filename;
        }

        $messageText = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $senderId,
            'message' => $request->message,
            'attachment' => $attachmentPath
        ]);
        $conversation->update([
            'last_message' => $request->message ?? 'photo',
            'last_message_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'data'   => $messageText
        ], 201);
    }

    public function getInbox(Request $request)
    {
        $userId = $request->user()->id;

        // İçinde benim olduğum tüm odaları getir
        // user_one BEN olabilirim VEYA user_two BEN olabilirim.
        $conversations = Conversation::where('user_one', $userId)
            ->orWhere('user_two', $userId)
            ->with(['sender', 'receiver']) // İki tarafın da bilgisini çek
            ->orderBy('last_message_at', 'desc') // En son yazışılan en üstte
            ->get();

        // Frontend için veriyi düzenleyelim (Karşı taraf kim?)
        $formatted = $conversations->map(function ($conv) use ($userId) {
            // Eğer user_one bensem, konuştuğum kişi user_two'dur (receiver).
            // Değilsem user_one'dır (sender).
            $otherUser = ($conv->user_one == $userId) ? $conv->receiver : $conv->sender;

            return [
                'conversation_id' => $conv->id,
                'other_user_id'     => $otherUser->id,
                'other_user_name' => $otherUser->name,
                'other_user_photo' => $otherUser->profile_photo_path, // Varsa
                'last_message'    => $conv->last_message,
                'time'            => $conv->last_message_at,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $formatted
        ], 200);
    }
    public function getMessages(Request $request, $conversationId)
    {
        $userId = $request->user()->id;

        // 1. Odayı bul
        $conversation = Conversation::findOrFail($conversationId);

        // 2. GÜVENLİK: Bu odaya girmeye yetkin var mı?
        if ($conversation->user_one != $userId && $conversation->user_two != $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 3. Mesajlar
        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender:id,name')
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        // 4. Okundu Yap (Karşıdan gelenleri)
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'status' => 'success',
            'data'   => $messages
        ], 200);
    }



    // for admin
    public function getAllConversationsAdmin()
    {
        // Sistemdeki tüm odalar
        $conversations = Conversation::with(['sender:id,name', 'receiver:id,name'])
            ->orderBy('last_message_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data'   => $conversations
        ], 200);
    }

    public function viewConversationAdmin($id)
    {
        // Güvenlik kontrolü YOK, çünkü bu Admin. Her odaya girebilir.
        // Okundu bilgisi güncellemiyoruz (Gizli takip).
        $messages = Message::where('conversation_id', $id)
            ->with('sender:id,name')
            ->orderBy('created_at', 'asc')
            ->get(); // Hepsini görsün

        return response()->json([
            'status' => 'success',
            'data'   => $messages
        ], 200);
    }
    public function deleteConversationAdmin($id)
    {
        $conversation = Conversation::findOrFail($id);

        $conversation->delete();

        return response()->json([
            'message' => 'Conversation deleted successfully'
        ], 200);
    }
}
