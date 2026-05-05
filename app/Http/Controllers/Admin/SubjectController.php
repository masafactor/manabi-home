<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(): Response
    {
        $subjects = Subject::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Subject $subject) => [
                'id' => $subject->id,
                'name' => $subject->name,
                'sort_order' => $subject->sort_order,
                'is_active' => $subject->is_active,
                'created_at' => $subject->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/subjects/index', [
            'subjects' => $subjects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/subjects/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:subjects,name'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        Subject::create($validated);

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', '教科を登録しました。');
    }

    public function edit(Subject $subject): Response
    {
        return Inertia::render('admin/subjects/edit', [
            'subject' => [
                'id' => $subject->id,
                'name' => $subject->name,
                'sort_order' => $subject->sort_order,
                'is_active' => $subject->is_active,
            ],
        ]);
    }

    public function update(Request $request, Subject $subject): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:subjects,name,' . $subject->id],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        $subject->update($validated);

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', '教科を更新しました。');
    }

    public function toggleActive(Subject $subject): RedirectResponse
    {
        $subject->update([
            'is_active' => ! $subject->is_active,
        ]);

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', '教科の有効状態を変更しました。');
    }
}