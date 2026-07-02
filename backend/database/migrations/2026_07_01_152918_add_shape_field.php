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
        schema::table('frames', function (Blueprint $table) {
            $table->json('shapes')->nullable()->after('fontSize');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
