<?php
return [
    'server_key' => env('MIDTRANS_SERVER_KEY', 'your-server-key-here'),
    'client_key' => env('MIDTRANS_CLIENT_KEY', 'your-client-key-here'),
    'merchant_id' => env('MIDTRANS_MERCHANT_ID', null),
    'is_production' => env('MIDTRANS_ENV', 'sandbox') === 'production',
    'is_sanitized' => true,
    'is_3ds' => true,
    'notification_url' => env('MIDTRANS_NOTIFICATION_URL', null),
];
