<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonView;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->studentProfile;

        $lessonsQuery = Lesson::query()
            ->with(['subject'])
            ->where('status', 'published')
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->orderByDesc('id');

        if ($profile) {
            $lessonsQuery
                ->where('school_stage', $profile->school_stage)
                ->where('grade', $profile->grade);
        }

        $lessonViews = LessonView::query()
            ->where('student_id', $user->id)
            ->get()
            ->keyBy('lesson_id');

        $lessons = $lessonsQuery
            ->get()
            ->map(function (Lesson $lesson) use ($lessonViews) {
                $view = $lessonViews->get($lesson->id);

                return [
                    'id' => $lesson->id,
                    'subject_name' => $lesson->subject?->name,
                    'school_stage' => $lesson->school_stage,
                    'school_stage_label' => $lesson->schoolStageLabel(),
                    'grade' => $lesson->grade,
                    'grade_label' => $lesson->gradeLabel(),
                    'unit_name' => $lesson->unit_name,
                    'title' => $lesson->title,
                    'description' => $lesson->description,
                    'thumbnail_url' => $lesson->thumbnail_url,
                    'published_at' => $lesson->published_at?->format('Y-m-d H:i'),
                    'is_completed' => $view?->is_completed ?? false,
                    'completed_at' => $view?->completed_at?->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('student/lessons/index', [
            'lessons' => $lessons,
            'profile' => $profile ? [
                'school_stage' => $profile->school_stage,
                'school_stage_label' => $profile->schoolStageLabel(),
                'grade' => $profile->grade,
                'grade_label' => $profile->gradeLabel(),
            ] : null,
        ]);
    }

    public function show(Request $request, Lesson $lesson): Response
    {
        abort_unless($lesson->status === 'published', 404);

        $user = $request->user();
        $profile = $user->studentProfile;

        if ($profile) {
            abort_unless(
                $lesson->school_stage === $profile->school_stage
                    && $lesson->grade === $profile->grade,
                403
            );
        }

        $lessonView = LessonView::firstOrCreate(
            [
                'lesson_id' => $lesson->id,
                'student_id' => $user->id,
            ],
            [
                'started_at' => now(),
                'is_completed' => false,
            ]
        );

        return Inertia::render('student/lessons/show', [
            'lesson' => [
                'id' => $lesson->id,
                'subject_name' => $lesson->subject?->name,
                'school_stage_label' => $lesson->schoolStageLabel(),
                'grade_label' => $lesson->gradeLabel(),
                'unit_name' => $lesson->unit_name,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'video_url' => $lesson->video_url,
                'thumbnail_url' => $lesson->thumbnail_url,
                'published_at' => $lesson->published_at?->format('Y-m-d H:i'),
                'is_completed' => $lessonView->is_completed,
                'completed_at' => $lessonView->completed_at?->format('Y-m-d H:i'),
                'memo' => $lessonView->memo,
            ],
        ]);
    }

    public function complete(Request $request, Lesson $lesson): RedirectResponse
    {
        abort_unless($lesson->status === 'published', 404);

        $user = $request->user();
        $profile = $user->studentProfile;

        if ($profile) {
            abort_unless(
                $lesson->school_stage === $profile->school_stage
                    && $lesson->grade === $profile->grade,
                403
            );
        }

        $validated = $request->validate([
            'memo' => ['nullable', 'string', 'max:2000'],
        ]);

        LessonView::updateOrCreate(
            [
                'lesson_id' => $lesson->id,
                'student_id' => $user->id,
            ],
            [
                'started_at' => now(),
                'completed_at' => now(),
                'is_completed' => true,
                'memo' => $validated['memo'] ?? null,
            ]
        );

        return redirect()
            ->route('student.lessons.show', $lesson)
            ->with('success', '授業を視聴完了にしました。');
    }
}