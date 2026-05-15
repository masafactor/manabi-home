<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Student\LessonController as StudentLessonController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\Student\QuizController as StudentQuizController;
use App\Http\Controllers\Student\LearningLogController;
use App\Http\Controllers\Guardian\StudentController as GuardianStudentController;
use App\Http\Controllers\Teacher\StudentController as TeacherStudentController;
use App\Http\Controllers\Teacher\LearningLogCommentController;
use App\Http\Controllers\Teacher\MonthlyReportController as TeacherMonthlyReportController;
use App\Http\Controllers\Guardian\MonthlyReportController as GuardianMonthlyReportController;


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

        Route::get('/students', [TeacherStudentController::class, 'index'])
            ->name('students.index');

        Route::get('/students/{student}', [TeacherStudentController::class, 'show'])
            ->name('students.show');

        Route::post('/learning-logs/{learningLog}/comments', [LearningLogCommentController::class, 'store'])
            ->name('learning-logs.comments.store');

        Route::delete('/learning-log-comments/{comment}', [LearningLogCommentController::class, 'destroy'])
            ->name('learning-log-comments.destroy');

        Route::get('/students/{student}/monthly-report', [TeacherMonthlyReportController::class, 'show'])
            ->name('students.monthly-report');
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


    Route::resource('quizzes', QuizController::class)
    ->only(['index', 'create', 'store']);

    Route::patch('quizzes/{quiz}/toggle-status', [QuizController::class, 'toggleStatus'])
        ->name('quizzes.toggle-status');


    Route::post('students/{student}/guardians', [StudentController::class, 'attachGuardian'])
    ->name('students.guardians.attach');

    Route::delete('students/{student}/guardians/{guardian}', [StudentController::class, 'detachGuardian'])
        ->name('students.guardians.detach');

    Route::post('students/{student}/teachers', [StudentController::class, 'attachTeacher'])
    ->name('students.teachers.attach');

    Route::delete('students/{student}/teachers/{teacher}', [StudentController::class, 'detachTeacher'])
        ->name('students.teachers.detach');
        
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


    Route::get('/quizzes/{quiz}', [StudentQuizController::class, 'show'])
    ->name('quizzes.show');

    Route::post('/quizzes/{quiz}/submit', [StudentQuizController::class, 'submit'])
        ->name('quizzes.submit');

    Route::get('/quiz-attempts/{attempt}', [StudentQuizController::class, 'result'])
        ->name('quiz-attempts.show');

    Route::resource('learning-logs', LearningLogController::class)
    ->only(['index', 'create', 'store', 'edit', 'update']);
        
});

Route::middleware(['role:guardian'])->prefix('guardian')->name('guardian.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('guardian/dashboard');
    })->name('dashboard');

    Route::get('/students', [GuardianStudentController::class, 'index'])
        ->name('students.index');

    Route::get('/students/{student}', [GuardianStudentController::class, 'show'])
        ->name('students.show');

    Route::get('/students/{student}/monthly-report', [GuardianMonthlyReportController::class, 'show'])
    ->name('students.monthly-report');
});
require __DIR__.'/settings.php';
