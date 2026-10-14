<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderConfirmation extends Mailable
{
    public $order;
    public $items;

    public function __construct(Order $order)
    {
        // Order ile birlikte ilişkili item’ları da yükle
        $this->order = $order->load('items.course'); // relation ismi sende farklı olabilir
        $this->items = $this->order->items;
    }

    public function build()
    {
        return $this->subject('Order Confirmation')
            ->view('emails.order-confirmation')
            ->with([
                'order' => $this->order,
                'items' => $this->items,
            ]);
    }
}
