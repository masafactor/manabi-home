<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonthlyReportController extends Controller
{
    public function show(Request $request, User $student): Response
    {
        $guardian = $request->user();

        $isLinked = $guardian->guardianStudents()
            ->where('users.id', $student->id)
            ->exists();

        abort_unless($isLinked, 403);
        abort_unless($student->role === 'student', 404);

        $targetMonth = $request->query('month', now()->format('Y-m'));

        $startDate = Carbon::parse($targetMonth . '-01')->startOfMonth();
        $endDate = (clone $startDate)->endOfMonth();

        $student->load(['studentProfile']);

        $lessonViews = $student->lessonViews()
            ->with(['lesson.subject'])
            ->whereBetween('completed_at', [$startDate, $endDate])
            ->where('is_completed', true)
            ->orderByDesc('completed_at')
            ->get();

        $quizAttempts = $student->quizAttempts()
            ->with(['quiz.lesson.subject'])
            ->whereBetween('submitted_at', [$startDate, $endDate])
            ->orderByDesc('submitted_at')
            ->get();

        $learningLogs = $student->learningLogs()
            ->with(['comments.teacher'])
            ->whereBetween('log_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderByDesc('log_date')
            ->get();

        $commentsCount = $learningLogs
            ->flatMap(fn ($log) => $log->comments)
            ->count();

        $averageScore = $quizAttempts->count() > 0
            ? round($quizAttempts->avg(fn ($attempt) => $attempt->percentage()))
            : null;

        $bestScore = $quizAttempts->count() > 0
            ? $quizAttempts->max(fn ($attempt) => $attempt->percentage())
            : null;

        return Inertia::render('guardian/monthly-reports/show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'profile' => $student->studentProfile ? [
                    'grade_label' => $student->studentProfile->gradeLabel(),
                    'school_name' => $student->studentProfile->school_name,
                ] : null,
            ],
            'month' => $startDate->format('Y-m'),
            'monthLabel' => $startDate->format('Y年n月'),
            'summary' => [
                'completed_lessons_count' => $lessonViews->count(),
                'quiz_attempts_count' => $quizAttempts->count(),
                'learning_logs_count' => $learningLogs->count(),
                'teacher_comments_count' => $commentsCount,
                'average_score' => $averageScore,
                'best_score' => $bestScore,
            ],
            'lessonViews' => $lessonViews->map(fn ($view) => [
                'id' => $view->id,
                'lesson_title' => $view->lesson?->title,
                'subject_name' => $view->lesson?->subject?->name,
                'unit_name' => $view->lesson?->unit_name,
                'completed_at' => $view->completed_at?->format('Y-m-d H:i'),
                'memo' => $view->memo,
            ]),
            'quizAttempts' => $quizAttempts->map(fn ($attempt) => [
                'id' => $attempt->id,
                'quiz_title' => $attempt->quiz?->title,
                'lesson_title' => $attempt->quiz?->lesson?->title,
                'subject_name' => $attempt->quiz?->lesson?->subject?->name,
                'score' => $attempt->score,
                'max_score' => $attempt->max_score,
                'percentage' => $attempt->percentage(),
                'submitted_at' => $attempt->submitted_at?->format('Y-m-d H:i'),
            ]),
            'learningLogs' => $learningLogs->map(fn ($log) => [
                'id' => $log->id,
                'log_date' => $log->log_date?->format('Y-m-d'),
                'did_text' => $log->did_text,
                'understood_text' => $log->understood_text,
                'difficult_text' => $log->difficult_text,
                'question_text' => $log->question_text,
                'mood_label' => $log->moodLabel(),
                'comments' => $log->comments->map(fn ($comment) => [
                    'id' => $comment->id,
                    'teacher_name' => $comment->teacher?->name,
                    'comment' => $comment->comment,
                    'created_at' => $comment->created_at?->format('Y-m-d H:i'),
                ]),
            ]),
        ]);
    }
}