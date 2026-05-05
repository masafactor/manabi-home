<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function index(): Response
    {
        $lessons = Lesson::query()
            ->with(['subject', 'teacher'])
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Lesson $lesson) => [
                'id' => $lesson->id,
                'subject_name' => $lesson->subject?->name,
                'teacher_name' => $lesson->teacher?->name,
                'grade' => $lesson->grade,
                'unit_name' => $lesson->unit_name,
                'title' => $lesson->title,
                'video_url' => $lesson->video_url,
                'thumbnail_url' => $lesson->thumbnail_url,
                'status' => $lesson->status,
                'published_at' => $lesson->published_at?->format('Y-m-d H:i'),
                'sort_order' => $lesson->sort_order,
                'created_at' => $lesson->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/lessons/index', [
            'lessons' => $lessons,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/lessons/create', [
            'subjects' => $this->subjectOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'grade' => ['nullable', 'integer', 'min:1', 'max:12'],
            'unit_name' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video_url' => ['required', 'url', 'max:2000'],
            'thumbnail_url' => ['nullable', 'url', 'max:2000'],
            'status' => ['required', 'in:draft,published,archived'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);

        $validated['teacher_id'] = $request->user()->id;
        $validated['published_at'] = $validated['status'] === 'published' ? now() : null;

        Lesson::create($validated);

        return redirect()
            ->route('admin.lessons.index')
            ->with('success', '授業動画を登録しました。');
    }

    public function edit(Lesson $lesson): Response
    {
        return Inertia::render('admin/lessons/edit', [
            'lesson' => [
                'id' => $lesson->id,
                'subject_id' => $lesson->subject_id,
                'grade' => $lesson->grade,
                'unit_name' => $lesson->unit_name,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'video_url' => $lesson->video_url,
                'thumbnail_url' => $lesson->thumbnail_url,
                'status' => $lesson->status,
                'sort_order' => $lesson->sort_order,
            ],
            'subjects' => $this->subjectOptions(),
        ]);
    }

    public function update(Request $request, Lesson $lesson): RedirectResponse
    {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'grade' => ['nullable', 'integer', 'min:1', 'max:12'],
            'unit_name' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'video_url' => ['required', 'url', 'max:2000'],
            'thumbnail_url' => ['nullable', 'url', 'max:2000'],
            'status' => ['required', 'in:draft,published,archived'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);

        if ($lesson->status !== 'published' && $validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        if ($validated['status'] !== 'published') {
            $validated['published_at'] = null;
        }

        $lesson->update($validated);

        return redirect()
            ->route('admin.lessons.index')
            ->with('success', '授業動画を更新しました。');
    }

    public function toggleStatus(Lesson $lesson): RedirectResponse
    {
        $nextStatus = $lesson->status === 'published' ? 'archived' : 'published';

        $lesson->update([
            'status' => $nextStatus,
            'published_at' => $nextStatus === 'published' ? now() : null,
        ]);

        return redirect()
            ->route('admin.lessons.index')
            ->with('success', '授業動画の公開状態を変更しました。');
    }

    private function subjectOptions(): array
    {
        return Subject::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'name'])
            ->map(fn (Subject $subject) => [
                'id' => $subject->id,
                'name' => $subject->name,
            ])
            ->all();
    }
}