import { Link, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { StudentLessonDetail } from '@/types/student-lesson';

type Props = {
    lesson: StudentLessonDetail;
};

export default function StudentLessonsShow({ lesson }: Props) {
    const { data, setData, processing, errors } = useForm({
        memo: lesson.memo ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.post(route('student.lessons.complete', lesson.id), data, {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={route('student.lessons.index')}
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← 授業一覧へ戻る
                </Link>

                <div className="mt-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            {lesson.subject_name ?? '未設定'}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            {lesson.grade_label}
                        </span>
                        {lesson.unit_name && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                {lesson.unit_name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold">{lesson.title}</h1>

                    {lesson.description && (
                        <p className="mt-3 text-gray-600">{lesson.description}</p>
                    )}

                    {lesson.is_completed && (
                        <p className="mt-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            この授業は視聴完了済みです。
                            {lesson.completed_at && ` 完了日時：${lesson.completed_at}`}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-lg border bg-white p-6">
                    <h2 className="mb-3 text-lg font-semibold">授業動画</h2>

                    <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        動画を開く
                    </a>

                    <p className="mt-3 break-all text-sm text-gray-500">
                        {lesson.video_url}
                    </p>
                </div>

                <form onSubmit={submit} className="rounded-lg border bg-white p-6">
                    <h2 className="text-lg font-semibold">視聴メモ</h2>

                    <p className="mt-1 text-sm text-gray-600">
                        分かったことや、あとで確認したいことを残せます。
                    </p>

                    <textarea
                        value={data.memo}
                        onChange={(e) => setData('memo', e.target.value)}
                        className="mt-4 min-h-32 w-full rounded-md border px-3 py-2"
                        placeholder="例：正負の数の足し算が少し分かった。"
                    />

                    {errors.memo && (
                        <p className="mt-1 text-sm text-red-600">{errors.memo}</p>
                    )}

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            視聴完了にする
                        </button>
                    </div>
                    {lesson.quizzes.length > 0 && (
                        <div className="rounded-lg border bg-white p-6">
                            <h2 className="mb-3 text-lg font-semibold">小テスト</h2>

                            <div className="space-y-2">
                                {lesson.quizzes.map((quiz) => (
                                    <Link
                                        key={quiz.id}
                                        href={route('student.quizzes.show', quiz.id)}
                                        className="block rounded-md border px-4 py-3 hover:bg-gray-50"
                                    >
                                        {quiz.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}