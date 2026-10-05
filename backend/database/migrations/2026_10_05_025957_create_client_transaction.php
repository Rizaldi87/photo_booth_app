<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('client_transaction', function (Blueprint $table) {
            $table->id();

            $table->string('client_name')->nullable();
            $table->unsignedBigInteger('layout_id');
            $table->unsignedBigInteger('frame_id')->nullable();
            $table->string('midtrans_order_id')->unique();
            $table->string('midtrans_status')->default('pending'); // pending, capture, settlement, expire, cancel, denial, failure
            $table->integer('amount');
            $table->string('payment_method')->nullable()->default('qris');
            $table->string('payment_type')->nullable();
            $table->string('snap_token')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('fraud_status')->nullable();
            $table->string('qr_code_url')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('layout_id')->references('id')->on('layouts')->onDelete('cascade');
            $table->foreign('frame_id')->references('id')->on('frames')->onDelete('set null');
            $table->index(['midtrans_order_id', 'midtrans_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_transaction');
    }
};
