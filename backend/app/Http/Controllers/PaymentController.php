<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ClientTransaction;
use App\Models\Layout;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Midtrans\Notification;
use Midtrans\Snap;
use Midtrans\Transaction;

class PaymentController extends Controller
{
    public function create(Request $req)
    {
        $validated = $req->validate([
            'client_name' => 'required|string|max:255',
            'layout_id' => 'required|exists:layouts,id',
            'frame_id' => 'nullable|exists:frames,id',
        ]);
        $layout = Layout::findOrFail($validated['layout_id']);
        $amount = (int) $layout->price;
        $orderId = 'BOOTH-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(6));

        $transaction = ClientTransaction::create([
            'client_name' => $validated['client_name'] ?? null,
            'layout_id' => $layout->id,
            'frame_id' => $validated['frame_id'] ?? null,
            'midtrans_order_id' => $orderId,
            'midtrans_status' => 'pending',
            'amount' => $amount,
            'payment_method' => 'qris',
        ]);
        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $amount,
            ],
            'item_details' => [
                [
                    'id' => 'layout-' . $layout->id,
                    'price' => $amount,
                    'quantity' => 1,
                    'name' => 'PhotoBooth - ' . $layout->name,
                ],
            ],
            'customer_details' => [
                'first_name' => $transaction->client_name ?: 'Guest',
                'last_name' => '',
            ],
            "expiry" => [
                "start_time" => now()->format('Y-m-d H:i:s O'),
                "unit" => "minutes",
                "duration" => 60
            ]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            $transaction->update(['snap_token' => $snapToken]);

            return response()->json([
                'snap_token' => $snapToken,
                'order_id' => $orderId,
                'client_key' => config('midtrans.client_key'),
                'amount' => $amount,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create Snap token',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function notification(Request $request)
    {
        try {
            $notif = new Notification();

            $orderId = $notif->order_id;
            $transactionStatus = $notif->transaction_status;
            $fraudStatus = $notif->fraud_status ?? null;
            $transactionId = $notif->transaction_id ?? null;
            $paymentType = $notif->payment_type ?? null;

            $transaction = ClientTransaction::where('midtrans_order_id', $orderId)->first();

            if (!$transaction) {
                return response()->json(['message' => 'Transaction not found'], 404);
            }

            // Update berdasarkan status Midtrans
            $data = [
                'transaction_id' => $transactionId,
                'payment_type' => $paymentType,
                'fraud_status' => $fraudStatus,
            ];

            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                if ($fraudStatus == 'challenge') {
                    $data['midtrans_status'] = 'challenge';
                } else {
                    $data['midtrans_status'] = 'settlement';
                    $data['paid_at'] = Carbon::now();
                }
            } elseif ($transactionStatus == 'pending') {
                $data['midtrans_status'] = 'pending';
            } elseif ($transactionStatus == 'expire') {
                $data['midtrans_status'] = 'expire';
            } elseif ($transactionStatus == 'cancel') {
                $data['midtrans_status'] = 'cancel';
            } elseif ($transactionStatus == 'deny') {
                $data['midtrans_status'] = 'deny';
            } elseif ($transactionStatus == 'failure') {
                $data['midtrans_status'] = 'failure';
            } else {
                $data['midtrans_status'] = $transactionStatus;
            }

            $transaction->update($data);

            return response()->json(['message' => 'Notification handled'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Notification failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function status(string $orderId)
    {
        $transaction = ClientTransaction::where('midtrans_order_id', $orderId)->firstOrFail();

        // Opsional: bisa re-verify ke Midtrans via Transaction::status() untuk lebih akurat
        // $status = Transaction::status($orderId); ...

        return response()->json([
            'order_id' => $transaction->midtrans_order_id,
            'status' => $transaction->midtrans_status,
            'paid_at' => $transaction->paid_at,
            'amount' => $transaction->amount,
            'transaction_id' => $transaction->transaction_id,
        ]);
    }

    public function verify(string $orderId)
    {
        $transaction = ClientTransaction::where(
            'midtrans_order_id',
            $orderId
        )->firstOrFail();

        try {
            $status = Transaction::status($orderId);

            $transactionStatus = $status->transaction_status ?? null;
            $fraudStatus = $status->fraud_status ?? null;

            $data = [
                'transaction_id' => $status->transaction_id ?? null,
                'payment_type' => $status->payment_type ?? null,
                'fraud_status' => $fraudStatus,
            ];

            if (
                $transactionStatus === 'capture' ||
                $transactionStatus === 'settlement'
            ) {
                if ($fraudStatus === 'challenge') {
                    $data['midtrans_status'] = 'challenge';
                } else {
                    $data['midtrans_status'] = 'settlement';

                    if (!$transaction->paid_at) {
                        $data['paid_at'] = now();
                    }
                }
            } elseif ($transactionStatus === 'pending') {
                $data['midtrans_status'] = 'pending';
            } elseif ($transactionStatus === 'expire') {
                $data['midtrans_status'] = 'expire';
            } elseif ($transactionStatus === 'cancel') {
                $data['midtrans_status'] = 'cancel';
            } elseif ($transactionStatus === 'deny') {
                $data['midtrans_status'] = 'deny';
            } elseif ($transactionStatus === 'failure') {
                $data['midtrans_status'] = 'failure';
            } else {
                $data['midtrans_status'] = $transactionStatus;
            }

            $transaction->update($data);
            $transaction->refresh();

            return response()->json([
                'message' => 'Transaction verified',
                'data' => [
                    'order_id' => $transaction->midtrans_order_id,
                    'status' => $transaction->midtrans_status,
                    'amount' => $transaction->amount,
                    'transaction_id' => $transaction->transaction_id,
                    'paid_at' => $transaction->paid_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to verify transaction',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        $transactions = ClientTransaction::with(['layout:id,name', 'frame:id,name'])
            ->latest()
            ->paginate(20);

        return response()->json($transactions);
    }
}
