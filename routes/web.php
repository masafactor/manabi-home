<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use App\Http\Controllers\Admin\SubjectController;


Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;

        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'teacher' => redirect()->route('teacher.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            'guardian' => redirect()->route('guardian.dashboard'),
            default => abort(403),
        };
    })->name('dashboard');

    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');
    });

    Route::middleware(['role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('teacher/dashboard');
        })->name('dashboard');
    });

    Route::middleware(['role:student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('student/dashboard');
        })->name('dashboard');
    });

    Route::middleware(['role:guardian'])->prefix('guardian')->name('guardian.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('guardian/dashboard');
        })->name('dashboard');
    });
    
});

Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('subjects', SubjectController::class)
        ->except(['show', 'destroy']);

    Route::patch('subjects/{subject}/toggle-active', [SubjectController::class, 'toggleActive'])
        ->name('subjects.toggle-active');
});
require __DIR__.'/settings.php';
