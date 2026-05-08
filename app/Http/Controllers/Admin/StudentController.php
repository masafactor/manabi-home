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
}