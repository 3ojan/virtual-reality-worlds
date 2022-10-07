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
            $table->string('socialMediaPreviewImagePath')->nullable();
            $table->string('description')->nullable();
            $table->bigInteger('countRooms');
            $table->string('lat')->nullable();
            $table->string('lng')->nullable();
            $table->boolean('isDraft');
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
