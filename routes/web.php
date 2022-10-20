<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

/////test routes
Route::get('/one-world', function () {
   return view('one-world');
});
Route::get('/test', function () {
    return view('test', ['name' => 'James']);
    // return '<div></div>';
});
Route::get('/testHome', function () {
   return view('testHome');
});
Route::get('/threejs', function () {
   return view('threejs');
});
Route::get('/playground', function () {
   return view('playground');
});

/////test routess


Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');


Route::get('/get/worlds/list', [App\Http\Controllers\WorldsController::class, 'getWorlds'])->name('worlds.list');

Route::post('/get/worlds/details', [App\Http\Controllers\WorldsController::class, 'getWorldDetails'])->name('worlds.details');

Route::post('/update/worlds/data', [App\Http\Controllers\WorldsController::class, 'updateWorldData']);

Route::post('/update/worlds/duplicate', [App\Http\Controllers\WorldsController::class, 'duplicate']);

Route::post('/get/worlds/getWorldData', [App\Http\Controllers\WorldsController::class, 'getWorldData']);

Route::post('/post/worlds/newWorld', [App\Http\Controllers\WorldsController::class, 'newWorld']);

///temp
Route::post('/post/worlds/{worldId}/deleteWorld', [App\Http\Controllers\WorldsController::class, 'deleteWorld']);


///images
//For adding an image
Route::get('/add-image',[App\Http\Controllers\ImageUploadController::class,'addImage'])->name('images.add');
//For storing an image
Route::post('/store-image',[App\Http\Controllers\ImageUploadController::class,'storeImage']);
//For showing an image
Route::get('/view-images',[App\Http\Controllers\ImageUploadController::class,'viewImages'])->name('images.view');
///images