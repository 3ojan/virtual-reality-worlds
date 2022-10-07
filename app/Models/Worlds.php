<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Worlds extends Model
{
    use HasFactory;

    protected $fillable = [
        'data',
        'previewBackgroundImagePath',
        'publicAvailable',
        'lockedForEditing',
        'name'
    ];

    ///default values
    protected $attributes = [
        'socialMediaPreviewImagePath' => "",
        'description' => "",
        'countRooms' => 0,
        'isDraft' => 0,
        'creator' => 1,
        'lat' => "",
        'lng' => "",
    ];
}
