<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\LearningLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LearningLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = LearningLog::query()
    ->with(['comments.teacher'])
    ->where('student_id', $request->user()->id)
    ->orderByDesc('log_date')
    ->get()
    ->map(fn (LearningLog $log) => [
        'id' => $log->id,
        'log_date' => $log->log_date?->format('Y-m-d'),
        'did_text' => $log->did_text,
        'understood_text' => $log->understood_text,
        'difficult_text' => $log->difficult_text,
        'question_text' => $log->question_text,
        'mood' => $log->mood,
        'mood_label' => $log->moodLabel(),
        'created_at' => $log->created_at?->format('Y-m-d H:i'),
        'comments' => $log->comments->map(fn ($comment) => [
            'id' => $comment->id,
            'teacher_name' => $comment->teacher?->name,
            'comment' => $comment->comment,
            'created_at' => $comment->created_at?->format('Y-m-d H:i'),
        ]),
    ]);

        return Inertia::render('student/learning-logs/index', [
            'logs' => $logs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('student/learning-logs/create', [
            'defaultDate' => now()->toDateString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'log_date' => ['required', 'date'],
            'did_text' => ['nullable', 'string', 'max:3000'],
            'understood_text' => ['nullable', 'string', 'max:3000'],
            'difficult_text' => ['nullable', 'string', 'max:3000'],
            'question_text' => ['nullable', 'string', 'max:3000'],
            'mood' => ['nullable', 'in:good,normal,tired,hard'],
        ]);

        LearningLog::updateOrCreate(
            [
                'student_id' => $request->user()->id,
                'log_date' => $validated['log_date'],
            ],
            [
                'did_text' => $validated['did_text'] ?? null,
                'understood_text' => $validated['understood_text'] ?? null,
                'difficult_text' => $validated['difficult_text'] ?? null,
                'question_text' => $validated['question_text'] ?? null,
                'mood' => $validated['mood'] ?? null,
            ]
        );

        return redirect()
            ->route('student.learning-logs.index')
            ->with('success', '学習記録を保存しました。');
    }

    public function edit(Request $request, LearningLog $learningLog): Response
    {
        abort_unless($learningLog->student_id === $request->user()->id, 403);

        return Inertia::render('student/learning-logs/edit', [
            'log' => [
                'id' => $learningLog->id,
                'log_date' => $learningLog->log_date?->format('Y-m-d'),
                'did_text' => $learningLog->did_text ?? '',
                'understood_text' => $learningLog->understood_text ?? '',
                'difficult_text' => $learningLog->difficult_text ?? '',
                'question_text' => $learningLog->question_text ?? '',
                'mood' => $learningLog->mood ?? '',
            ],
        ]);
    }

    public function update(Request $request, LearningLog $learningLog): RedirectResponse
    {
        abort_unless($learningLog->student_id === $request->user()->id, 403);

        $validated = $request->validate([
            'log_date' => ['required', 'date'],
            'did_text' => ['nullable', 'string', 'max:3000'],
            'understood_text' => ['nullable', 'string', 'max:3000'],
            'difficult_text' => ['nullable', 'string', 'max:3000'],
            'question_text' => ['nullable', 'string', 'max:3000'],
            'mood' => ['nullable', 'in:good,normal,tired,hard'],
        ]);

        $learningLog->update([
            'log_date' => $validated['log_date'],
            'did_text' => $validated['did_text'] ?? null,
            'understood_text' => $validated['understood_text'] ?? null,
            'difficult_text' => $validated['difficult_text'] ?? null,
            'question_text' => $validated['question_text'] ?? null,
            'mood' => $validated['mood'] ?? null,
        ]);

        return redirect()
            ->route('student.learning-logs.index')
            ->with('success', '学習記録を更新しました。');
    }
}