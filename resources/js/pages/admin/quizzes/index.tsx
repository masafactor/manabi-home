import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { AdminQuiz } from '@/types/quiz';

type Props = {
    quizzes: AdminQuiz[];
};

const statusLabels: Record<string, string> = {
    draft: '下書き',
    published: '公開中',
    archived: '非公開',
};

export default function AdminQuizzesIndex({ quizzes }: Props) {
    const toggleStatus = (quiz: AdminQuiz) => {
        router.patch(route('admin.quizzes.toggle-status', quiz.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">小テスト管理</h1>
                    <p className="mt-1 text-gray-600">
                        授業動画に紐づく小テストを管理します。
                    </p>
                </div>

                <Link
                    href={route('admin.quizzes.create')}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    小テストを追加
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b px-4 py-3">タイトル</th>
                            <th className="border-b px-4 py-3">授業</th>
                            <th className="border-b px-4 py-3">状態</th>
                            <th className="border-b px-4 py-3">合格点</th>
                            <th className="border-b px-4 py-3">作成日</th>
                            <th className="border-b px-4 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                    小テストがまだ登録されていません。
                                </td>
                            </tr>
                        ) : (
                            quizzes.map((quiz) => (
                                <tr key={quiz.id}>
                                    <td className="border-b px-4 py-3 font-medium">
                                        {quiz.title}
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {quiz.subject_name ?? '-'} / {quiz.lesson_title ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                            {statusLabels[quiz.status] ?? quiz.status}
                                        </span>
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        {quiz.passing_score ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {quiz.created_at ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(quiz)}
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                {quiz.status === 'published'
                                                    ? '非公開にする'
                                                    : '公開する'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}