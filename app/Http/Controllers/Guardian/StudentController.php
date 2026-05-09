<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $guardian = $request->user();

        $students = $guardian->guardianStudents()
            ->with(['studentProfile'])
            ->orderBy('users.id')
            ->get()
            ->map(fn (User $student) => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'relationship' => $student->pivot->relationship,
                'profile' => $student->studentProfile ? [
                    'school_stage' => $student->studentProfile->school_stage,
                    'school_stage_label' => $student->studentProfile->schoolStageLabel(),
                    'grade' => $student->studentProfile->grade,
                    'grade_label' => $student->studentProfile->gradeLabel(),
                    'school_name' => $student->studentProfile->school_name,
                ] : null,
            ]);

        return Inertia::render('guardian/students/index', [
            'students' => $students,
        ]);
    }

    public function show(Request $request, User $student): Response
    {
        $guardian = $request->user();

        $isLinked = $guardian->guardianStudents()
            ->where('users.id', $student->id)
            ->exists();

        abort_unless($isLinked, 403);
        abort_unless($student->role === 'student', 404);

        $student->load(['studentProfile']);

        $lessonViews = $student->lessonViews()
            ->with(['lesson.subject'])
            ->orderByDesc('completed_at')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn ($view) => [
                'id' => $view->id,
                'lesson_title' => $view->lesson?->title,
                'subject_name' => $view->lesson?->subject?->name,
                'unit_name' => $view->lesson?->unit_name,
                'is_completed' => $view->is_completed,
                'completed_at' => $view->completed_at?->format('Y-m-d H:i'),
                'memo' => $view->memo,
            ]);

        $quizAttempts = $student->quizAttempts()
            ->with(['quiz.lesson.subject'])
            ->orderByDesc('submitted_at')
            ->limit(10)
            ->get()
            ->map(fn ($attempt) => [
                'id' => $attempt->id,
                'quiz_title' => $attempt->quiz?->title,
                'lesson_title' => $attempt->quiz?->lesson?->title,
                'subject_name' => $attempt->quiz?->lesson?->subject?->name,
                'score' => $attempt->score,
                'max_score' => $attempt->max_score,
                'percentage' => $attempt->percentage(),
                'submitted_at' => $attempt->submitted_at?->format('Y-m-d H:i'),
            ]);

        $learningLogs = $student->learningLogs()
            ->orderByDesc('log_date')
            ->limit(10)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'log_date' => $log->log_date?->format('Y-m-d'),
                'did_text' => $log->did_text,
                'understood_text' => $log->understood_text,
                'difficult_text' => $log->difficult_text,
                'question_text' => $log->question_text,
                'mood' => $log->mood,
                'mood_label' => $log->moodLabel(),
            ]);

        $summary = [
            'completed_lessons_count' => $student->lessonViews()
                ->where('is_completed', true)
                ->count(),
            'quiz_attempts_count' => $student->quizAttempts()->count(),
            'learning_logs_count' => $student->learningLogs()->count(),
            'latest_learning_log_date' => $student->learningLogs()
                ->latest('log_date')
                ->value('log_date'),
        ];

        return Inertia::render('guardian/students/show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'profile' => $student->studentProfile ? [
                    'school_stage' => $student->studentProfile->school_stage,
                    'school_stage_label' => $student->studentProfile->schoolStageLabel(),
                    'grade' => $student->studentProfile->grade,
                    'grade_label' => $student->studentProfile->gradeLabel(),
                    'school_name' => $student->studentProfile->school_name,
                ] : null,
            ],
            'summary' => $summary,
            'lessonViews' => $lessonViews,
            'quizAttempts' => $quizAttempts,
            'learningLogs' => $learningLogs,
        ]);
    }
}