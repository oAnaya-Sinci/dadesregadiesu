<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Auth::routes();
Auth::routes(['reset' => false]);

Route::get('/', function () {
    return redirect('/parques');
});

Route::group(['middleware' => ['auth']], function () {

    Route::get('/parques', [App\Http\Controllers\parques\ParquesController::class, 'index'])->name('parques');
    // Route::get('/parques/obtain_data/{id_register}', [App\Http\Controllers\parques\ParquesController::class, 'obtainData'])->name('data_sensores');
    Route::get('/parques/obtain_data_info/', [App\Http\Controllers\parques\ParquesController::class, 'obtainData_info'])->name('data_sensores');
    Route::get('/parques/obtain_data_schedule/', [App\Http\Controllers\parques\ParquesController::class, 'obtainDataSchedule'])->name('data_schedule');
    Route::get('/parques/obtain_data_mqqt/', [App\Http\Controllers\parques\ParquesController::class, 'obtainDataMQTT_Table'])->name('data_mqtt');
    Route::post('/parques/save_data/', [App\Http\Controllers\parques\ParquesController::class, 'store'])->name('save_data');

    Route::get('/logout_session' ,[App\Http\Controllers\parques\ParquesController::class,'logout_session'])->name('logout_session');
}); 

Route::get('phpmyinfo', function () { phpinfo(); })->name('phpmyinfo');