<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->orderBy('id')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'role_label' => $this->roleLabel($user->role),
                'created_at' => $user->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roleOptions' => $this->roleOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roleOptions' => $this->roleOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['admin', 'teacher', 'student', 'guardian'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'ユーザーを登録しました。');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'roleOptions' => $this->roleOptions(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => ['required', Rule::in(['admin', 'teacher', 'student', 'guardian'])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            ...(! empty($validated['password'])
                ? ['password' => Hash::make($validated['password'])]
                : []),
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'ユーザーを更新しました。');
    }

    private function roleOptions(): array
    {
        return [
            ['value' => 'admin', 'label' => '管理者'],
            ['value' => 'teacher', 'label' => '先生・支援者'],
            ['value' => 'student', 'label' => '生徒'],
            ['value' => 'guardian', 'label' => '保護者'],
        ];
    }

    private function roleLabel(?string $role): string
    {
        return match ($role) {
            'admin' => '管理者',
            'teacher' => '先生・支援者',
            'student' => '生徒',
            'guardian' => '保護者',
            default => '未設定',
        };
    }
}