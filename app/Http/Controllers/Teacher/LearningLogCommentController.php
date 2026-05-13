<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\LearningLog;
use App\Models\LearningLogComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LearningLogCommentController extends Controller
{
    public function store(Request $request, LearningLog $learningLog): RedirectResponse
    {
        $teacher = $request->user();
        $student = $learningLog->student;

        $isLinked = $teacher->teacherStudents()
            ->where('users.id', $student->id)
            ->exists();

        abort_unless($isLinked, 403);

        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:2000'],
        ]);

        LearningLogComment::create([
            'learning_log_id' => $learningLog->id,
            'teacher_id' => $teacher->id,
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'コメントを投稿しました。');
    }

    public function destroy(Request $request, LearningLogComment $comment): RedirectResponse
    {
        abort_unless($comment->teacher_id === $request->user()->id, 403);

        $comment->delete();

        return back()->with('success', 'コメントを削除しました。');
    }
}