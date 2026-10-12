<!DOCTYPE html>
<html>

<head>
    <title>Order Confirmation</title>
</head>

<body>
    <h1>Your Order Has Been Received!</h1>

    <p>Hello {{ $order->user->name }},</p>

    <p>Order Number: <strong>{{ $order->order_code }}</strong></p>
    <p>Total Amount: <strong>{{ $order->total_price }} TL</strong></p>
    <p>Status: <strong>{{ $order->status }}</strong></p>

    <h3>Order Details:</h3>
    <ul>
        @foreach($order->orderItems as $item)
            <li>
                {{ $item->course->name }} - {{ $item->price }} TL
            </li>
        @endforeach
    </ul>

    <p>You can access your courses <a href="{{ url('/user/my-courses') }}">here</a>.</p>

    <p>Happy learning!</p>
</body>

</html>