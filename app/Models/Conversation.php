<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_one',        
        'user_two',        
        'last_message',    
        'last_message_at', 
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];
    
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_one');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'user_two');
    }

    //helper method
    public function getOtherUser($myId)
    {
        if ($this->user_one == $myId) {
            return $this->receiver; 
        }
        return $this->sender;
    }
}
