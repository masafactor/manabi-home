<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizChoice;
use App\Models\QuizQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function index(): Response
    {
        $quizzes = Quiz::query()
            ->with(['lesson.subject'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (Quiz $quiz) => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'lesson_title' => $quiz->lesson?->title,
                'subject_name' => $quiz->lesson?->subject?->name,
                'status' => $quiz->status,
                'passing_score' => $quiz->passing_score,
                'created_at' => $quiz->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/quizzes/index', [
            'quizzes' => $quizzes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/quizzes/create', [
            'lessons' => $this->lessonOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lesson_id' => ['required', 'exists:lessons,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'passing_score' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:draft,published,archived'],

            'question_text' => ['required', 'string'],
            'explanation' => ['nullable', 'string'],
            'points' => ['required', 'integer', 'min:1', 'max:100'],

            'choices' => ['required', 'array', 'size:4'],
            'choices.*' => ['required', 'string', 'max:1000'],
            'correct_choice_index' => ['required', 'integer', 'min:0', 'max:3'],
        ]);

        $quiz = Quiz::create([
            'lesson_id' => $validated['lesson_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'passing_score' => $validated['passing_score'] ?? null,
            'status' => $validated['status'],
        ]);

        $question = QuizQuestion::create([
            'quiz_id' => $quiz->id,
            'question_text' => $validated['question_text'],
            'question_type' => 'choice',
            'points' => $validated['points'],
            'explanation' => $validated['explanation'] ?? null,
            'sort_order' => 1,
        ]);

        foreach ($validated['choices'] as $index => $choiceText) {
            QuizChoice::create([
                'quiz_question_id' => $question->id,
                'choice_text' => $choiceText,
                'is_correct' => $index === $validated['correct_choice_index'],
                'sort_order' => $index + 1,
            ]);
        }

        return redirect()
            ->route('admin.quizzes.index')
            ->with('success', '小テストを登録しました。');
    }

    public function toggleStatus(Quiz $quiz): RedirectResponse
    {
        $nextStatus = $quiz->status === 'published' ? 'archived' : 'published';

        $quiz->update([
            'status' => $nextStatus,
        ]);

        return redirect()
            ->route('admin.quizzes.index')
            ->with('success', '小テストの公開状態を変更しました。');
    }

    private function lessonOptions(): array
    {
        return Lesson::query()
            ->with('subject')
            ->orderBy('school_stage')
            ->orderBy('grade')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Lesson $lesson) => [
                'id' => $lesson->id,
                'label' => sprintf(
                    '%s / %s / %s',
                    $lesson->subject?->name ?? '教科未設定',
                    $lesson->gradeLabel(),
                    $lesson->title
                ),
            ])
            ->all();
    }
}