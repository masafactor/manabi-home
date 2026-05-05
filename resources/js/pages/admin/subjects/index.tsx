import { Link, router } from '@inertiajs/react';
import type { Subject } from '@/types/subject';
import { route } from 'ziggy-js';

type Props = {
    subjects: Subject[];
};

export default function AdminSubjectsIndex({ subjects }: Props) {
    const toggleActive = (subject: Subject) => {
        router.patch(route('admin.subjects.toggle-active', subject.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">教科管理</h1>
                    <p className="mt-1 text-gray-600">
                        授業動画で使用する教科を管理します。
                    </p>
                </div>

                <Link
                    href={route('admin.subjects.create')}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    教科を追加
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b px-4 py-3">表示順</th>
                            <th className="border-b px-4 py-3">教科名</th>
                            <th className="border-b px-4 py-3">状態</th>
                            <th className="border-b px-4 py-3">作成日</th>
                            <th className="border-b px-4 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                    教科がまだ登録されていません。
                                </td>
                            </tr>
                        ) : (
                            subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td className="border-b px-4 py-3">
                                        {subject.sort_order}
                                    </td>
                                    <td className="border-b px-4 py-3 font-medium">
                                        {subject.name}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <span
                                            className={
                                                subject.is_active
                                                    ? 'rounded-full bg-green-100 px-2 py-1 text-xs text-green-700'
                                                    : 'rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600'
                                            }
                                        >
                                            {subject.is_active ? '有効' : '無効'}
                                        </span>
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {subject.created_at}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={route('admin.subjects.edit', subject.id)}
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                編集
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => toggleActive(subject)}
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                {subject.is_active ? '無効にする' : '有効にする'}
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