import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { FormEvent } from 'react';
import type { Subject } from '@/types/subject';

type Props = {
    subject: Subject;
};

export default function AdminSubjectsEdit({ subject }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: subject.name,
        sort_order: subject.sort_order,
        is_active: subject.is_active,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        put(route('admin.subjects.update', subject.id));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">教科編集</h1>
                <p className="mt-1 text-gray-600">
                    登録済みの教科情報を編集します。
                </p>
            </div>

            <form onSubmit={submit} className="max-w-xl space-y-5 rounded-lg border bg-white p-6">
                <div>
                    <label className="block text-sm font-medium">教科名</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">表示順</label>
                    <input
                        type="number"
                        min="0"
                        value={data.sort_order}
                        onChange={(e) => setData('sort_order', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                    {errors.sort_order && (
                        <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>
                    )}
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    <span className="text-sm">有効にする</span>
                </label>

                {errors.is_active && (
                    <p className="text-sm text-red-600">{errors.is_active}</p>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        更新する
                    </button>

                    <Link
                        href={route('admin.subjects.index')}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        戻る
                    </Link>
                </div>
            </form>
        </div>
    );
}