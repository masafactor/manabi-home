<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\QuizChoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function show(Request $request, Quiz $quiz): Response
    {
        abort_unless($quiz->status === 'published', 404);

        $quiz->load(['lesson.subject', 'questions.choices']);

        $user = $request->user();
        $profile = $user->studentProfile;
        $lesson = $quiz->lesson;

        if ($profile) {
            abort_unless(
                $lesson->school_stage === $profile->school_stage
                    && $lesson->grade === $profile->grade,
                403
            );
        }

        return Inertia::render('student/quizzes/show', [
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description,
                'lesson_title' => $lesson->title,
                'subject_name' => $lesson->subject?->name,
                'questions' => $quiz->questions->map(fn ($question) => [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'points' => $question->points,
                    'choices' => $question->choices->map(fn ($choice) => [
                        'id' => $choice->id,
                        'choice_text' => $choice->choice_text,
                    ]),
                ]),
            ],
        ]);
    }

    public function submit(Request $request, Quiz $quiz): RedirectResponse
    {
        abort_unless($quiz->status === 'published', 404);

        $quiz->load(['lesson', 'questions.choices']);

        $user = $request->user();
        $profile = $user->studentProfile;
        $lesson = $quiz->lesson;

        if ($profile) {
            abort_unless(
                $lesson->school_stage === $profile->school_stage
                    && $lesson->grade === $profile->grade,
                403
            );
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*' => ['required', 'integer', 'exists:quiz_choices,id'],
        ]);

        $score = 0;
        $maxScore = $quiz->questions->sum('points');

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $user->id,
            'score' => 0,
            'max_score' => $maxScore,
            'submitted_at' => now(),
        ]);

        foreach ($quiz->questions as $question) {
            $selectedChoiceId = $validated['answers'][$question->id] ?? null;
            $selectedChoice = QuizChoice::query()
                ->where('id', $selectedChoiceId)
                ->where('quiz_question_id', $question->id)
                ->first();

            $isCorrect = $selectedChoice?->is_correct ?? false;
            $pointsAwarded = $isCorrect ? $question->points : 0;
            $score += $pointsAwarded;

            QuizAnswer::create([
                'quiz_attempt_id' => $attempt->id,
                'quiz_question_id' => $question->id,
                'selected_choice_id' => $selectedChoice?->id,
                'is_correct' => $isCorrect,
                'points_awarded' => $pointsAwarded,
            ]);
        }

        $attempt->update([
            'score' => $score,
        ]);

        return redirect()
            ->route('student.quiz-attempts.show', $attempt)
            ->with('success', '小テストを提出しました。');
    }

    public function result(QuizAttempt $attempt): Response
    {
        abort_unless($attempt->student_id === auth()->id(), 403);

        $attempt->load([
            'quiz.lesson.subject',
            'answers.question.choices',
            'answers.selectedChoice',
        ]);

        return Inertia::render('student/quizzes/result', [
            'attempt' => [
                'id' => $attempt->id,
                'score' => $attempt->score,
                'max_score' => $attempt->max_score,
                'percentage' => $attempt->percentage(),
                'submitted_at' => $attempt->submitted_at?->format('Y-m-d H:i'),
                'quiz' => [
                    'title' => $attempt->quiz->title,
                    'lesson_title' => $attempt->quiz->lesson?->title,
                    'subject_name' => $attempt->quiz->lesson?->subject?->name,
                ],
                'answers' => $attempt->answers->map(fn ($answer) => [
                    'id' => $answer->id,
                    'question_text' => $answer->question->question_text,
                    'selected_choice_text' => $answer->selectedChoice?->choice_text,
                    'is_correct' => $answer->is_correct,
                    'points_awarded' => $answer->points_awarded,
                    'points' => $answer->question->points,
                    'explanation' => $answer->question->explanation,
                    'choices' => $answer->question->choices->map(fn ($choice) => [
                        'id' => $choice->id,
                        'choice_text' => $choice->choice_text,
                        'is_correct' => $choice->is_correct,
                    ]),
                ]),
            ],
        ]);
    }
}