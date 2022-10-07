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

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');



Route::get('/get/worlds/list', [App\Http\Controllers\WorldsController::class, 'getWorlds'])->name('worlds.list');

Route::post('/get/worlds/details', [App\Http\Controllers\WorldsController::class, 'getWorldDetails'])->name('worlds.details');

Route::post('/update/worlds/data', [App\Http\Controllers\WorldsController::class, 'updateWorldData']);

Route::post('/update/worlds/duplicate', [App\Http\Controllers\WorldsController::class, 'duplicate']);

Route::post('/get/worlds/getWorldData', [App\Http\Controllers\WorldsController::class, 'getWorldData']);


