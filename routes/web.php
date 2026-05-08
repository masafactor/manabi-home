<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Student\LessonController as StudentLessonController;
use App\Http\Controllers\Admin\StudentController;

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

    Route::resource('lessons', LessonController::class)
    ->except(['show', 'destroy']);

    Route::patch('lessons/{lesson}/toggle-status', [LessonController::class, 'toggleStatus'])
        ->name('lessons.toggle-status');


    Route::get('students', [StudentController::class, 'index'])
    ->name('students.index');

    Route::get('students/{student}/profile/edit', [StudentController::class, 'editProfile'])
        ->name('students.profile.edit');

    Route::put('students/{student}/profile', [StudentController::class, 'updateProfile'])
        ->name('students.profile.update');
        
});

Route::middleware(['role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('student/dashboard');
    })->name('dashboard');

    Route::get('/lessons', [StudentLessonController::class, 'index'])
        ->name('lessons.index');

    Route::get('/lessons/{lesson}', [StudentLessonController::class, 'show'])
        ->name('lessons.show');

    Route::post('/lessons/{lesson}/complete', [StudentLessonController::class, 'complete'])
        ->name('lessons.complete');
});
require __DIR__.'/settings.php';
