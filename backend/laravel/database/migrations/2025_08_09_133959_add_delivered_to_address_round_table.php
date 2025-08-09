<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('address_round', function (Blueprint $table) {
            $table->boolean('delivered')->default(false);
        });
    }

    public function down()
    {
        Schema::table('address_round', function (Blueprint $table) {
            $table->dropColumn('delivered');
        });
    }
};
