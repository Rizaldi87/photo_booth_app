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
        Schema::table('layouts', function (Blueprint $table) {
            $table->integer('column')->default(1);
            $table->integer('row')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('layouts', function (Blueprint $table) {
            $table->dropColumn('column');
            $table->dropColumn('row');
        });
    }
};
