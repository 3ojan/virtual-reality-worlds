<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('worlds', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamp('created')->nullable();
            $table->timestamp('updated')->nullable();
            $table->string('data');
            $table->string('previewBackgroundImagePath')->nullable();
            $table->boolean('publicAvailable');
            $table->boolean('lockedForEditing')->nullable();
            $table->string('socialMediaPreviewImagePath')->nullable()->default("");
            $table->string('description')->nullable()->default("");
            $table->bigInteger('countRooms')->default(1);
            $table->string('lat')->nullable()->default("");
            $table->string('lng')->nullable()->default("");
            $table->boolean('isDraft')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('worlds');
    }
}
