<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        $students = User::query()
            ->with('studentProfile')
            ->where('role', 'student')
            ->orderBy('id')
            ->get()
            ->map(fn (User $student) => [
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
                'created_at' => $student->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/students/index', [
            'students' => $students,
        ]);
    }

    public function editProfile(User $student): Response
    {
        abort_unless($student->role === 'student', 404);

        $profile = $student->studentProfile;

        $guardianOptions = User::query()
            ->where('role', 'guardian')
            ->orderBy('id')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $guardian) => [
                'id' => $guardian->id,
                'name' => $guardian->name,
                'email' => $guardian->email,
            ]);

        $guardians = $student->guardians()
            ->get()
            ->map(fn (User $guardian) => [
                'id' => $guardian->id,
                'name' => $guardian->name,
                'email' => $guardian->email,
                'relationship' => $guardian->pivot->relationship,
            ]);


            $teacherOptions = User::query()
            ->where('role', 'teacher')
            ->orderBy('id')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $teacher) => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
            ]);

        $teachers = $student->teachers()
            ->get()
            ->map(fn (User $teacher) => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
                'relationship' => $teacher->pivot->relationship,
            ]);

        return Inertia::render('admin/students/profile-edit', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
            ],
            'profile' => [
                'school_stage' => $profile?->school_stage ?? 'junior_high',
                'grade' => $profile?->grade ?? '',
                'school_name' => $profile?->school_name ?? '',
                'note' => $profile?->note ?? '',
            ],
            'guardianOptions' => $guardianOptions,
            'guardians' => $guardians,
            'teacherOptions' => $teacherOptions,
            'teachers' => $teachers,
        ]);
    }

    public function updateProfile(Request $request, User $student): RedirectResponse
    {
        abort_unless($student->role === 'student', 404);

        $validated = $request->validate([
            'school_stage' => ['required', 'in:elementary,junior_high,high_school'],
            'grade' => ['required', 'integer', 'min:1', 'max:6'],
            'school_name' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:2000'],
        ]);

        StudentProfile::updateOrCreate(
            ['user_id' => $student->id],
            [
                'school_stage' => $validated['school_stage'],
                'grade' => $validated['grade'],
                'school_name' => $validated['school_name'] ?? null,
                'note' => $validated['note'] ?? null,
            ]
        );

        return redirect()
            ->route('admin.students.index')
            ->with('success', '生徒プロフィールを更新しました。');
    }

    public function attachGuardian(Request $request, User $student): RedirectResponse
    {
        abort_unless($student->role === 'student', 404);

        $validated = $request->validate([
            'guardian_id' => ['required', 'exists:users,id'],
            'relationship' => ['nullable', 'string', 'max:255'],
        ]);

        $guardian = User::findOrFail($validated['guardian_id']);

        abort_if($guardian->role !== 'guardian', 422, '選択されたユーザーは保護者ではありません。');

        $student->guardians()->syncWithoutDetaching([
            $guardian->id => [
                'relationship' => $validated['relationship'] ?? null,
            ],
        ]);

        return back()->with('success', '保護者を紐づけました。');
    }

    public function detachGuardian(User $student, User $guardian): RedirectResponse
    {
        abort_unless($student->role === 'student', 404);
        abort_unless($guardian->role === 'guardian', 404);

        $student->guardians()->detach($guardian->id);

        return back()->with('success', '保護者の紐づけを解除しました。');
    }

    public function attachTeacher(Request $request, User $student): RedirectResponse
    {
        abort_unless($student->role === 'student', 404);

        $validated = $request->validate([
            'teacher_id' => ['required', 'exists:users,id'],
            'relationship' => ['nullable', 'string', 'max:255'],
        ]);

        $teacher = User::findOrFail($validated['teacher_id']);

        abort_if($teacher->role !== 'teacher', 422, '選択されたユーザーは先生ではありません。');

        $student->teachers()->syncWithoutDetaching([
            $teacher->id => [
                'relationship' => $validated['relationship'] ?? null,
            ],
        ]);

        return back()->with('success', '先生を紐づけました。');
    }

    public function detachTeacher(User $student, User $teacher): RedirectResponse
    {
        abort_unless($student->role === 'student', 404);
        abort_unless($teacher->role === 'teacher', 404);

        $student->teachers()->detach($teacher->id);

        return back()->with('success', '先生の紐づけを解除しました。');
    }
}