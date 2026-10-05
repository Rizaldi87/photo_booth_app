<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientTransaction extends Model
{
    protected $table = 'client_transaction';

    protected $fillable = [
        'client_name',
        'layout_id',
        'frame_id',
        'midtrans_order_id',
        'midtrans_status',
        'amount',
        'payment_method',
        'payment_type',
        'snap_token',
        'transaction_id',
        'fraud_status',
        'qr_code_url',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'paid_at' => 'datetime',
    ];

    public function layout(): BelongsTo
    {
        return $this->belongsTo(Layout::class);
    }

    public function frame(): BelongsTo
    {
        return $this->belongsTo(Frame::class);
    }
}
