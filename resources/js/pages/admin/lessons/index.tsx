import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { Lesson } from '@/types/lesson';

type Props = {
    lessons: Lesson[];
};

const statusLabels: Record<string, string> = {
    draft: '下書き',
    published: '公開中',
    archived: '非公開',
};

export default function AdminLessonsIndex({ lessons }: Props) {
    const toggleStatus = (lesson: Lesson) => {
        router.patch(route('admin.lessons.toggle-status', lesson.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">授業動画管理</h1>
                    <p className="mt-1 text-gray-600">
                        生徒が視聴する授業動画を管理します。
                    </p>
                </div>

                <Link
                    href={route('admin.lessons.create')}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    授業動画を追加
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b px-4 py-3">表示順</th>
                            <th className="border-b px-4 py-3">教科</th>
                            <th className="border-b px-4 py-3">学年</th>
                            <th className="border-b px-4 py-3">タイトル</th>
                            <th className="border-b px-4 py-3">状態</th>
                            <th className="border-b px-4 py-3">公開日時</th>
                            <th className="border-b px-4 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                    授業動画がまだ登録されていません。
                                </td>
                            </tr>
                        ) : (
                            lessons.map((lesson) => (
                                <tr key={lesson.id}>
                                    <td className="border-b px-4 py-3">
                                        {lesson.sort_order}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        {lesson.subject_name ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        {lesson.grade ? `${lesson.grade}年` : '-'}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <div className="font-medium">{lesson.title}</div>
                                        {lesson.unit_name && (
                                            <div className="text-xs text-gray-500">
                                                {lesson.unit_name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                            {statusLabels[lesson.status] ?? lesson.status}
                                        </span>
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {lesson.published_at ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <a
                                                href={lesson.video_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                動画
                                            </a>

                                            <Link
                                                href={route('admin.lessons.edit', lesson.id)}
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                編集
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(lesson)}
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                {lesson.status === 'published'
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