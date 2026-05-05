import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { LessonForm, SubjectOption } from '@/types/lesson';

type EditableLesson = LessonForm & {
    id: number;
};

type Props = {
    lesson: EditableLesson;
    subjects: SubjectOption[];
};

export default function AdminLessonsEdit({ lesson, subjects }: Props) {
    const { data, setData, put, processing, errors } = useForm<LessonForm>({
        subject_id: lesson.subject_id,
        grade: lesson.grade ?? '',
        unit_name: lesson.unit_name ?? '',
        title: lesson.title,
        description: lesson.description ?? '',
        video_url: lesson.video_url,
        thumbnail_url: lesson.thumbnail_url ?? '',
        status: lesson.status,
        sort_order: lesson.sort_order,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('admin.lessons.update', lesson.id));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">授業動画編集</h1>
                <p className="mt-1 text-gray-600">
                    登録済みの授業動画を編集します。
                </p>
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-lg border bg-white p-6">
                <div>
                    <label className="block text-sm font-medium">教科</label>
                    <select
                        value={data.subject_id}
                        onChange={(e) => setData('subject_id', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    >
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subject_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">学年</label>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={data.grade}
                        onChange={(e) =>
                            setData('grade', e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                    {errors.grade && (
                        <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">単元名</label>
                    <input
                        type="text"
                        value={data.unit_name}
                        onChange={(e) => setData('unit_name', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                    {errors.unit_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.unit_name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">授業タイトル</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">説明</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">動画URL</label>
                    <input
                        type="url"
                        value={data.video_url}
                        onChange={(e) => setData('video_url', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                    {errors.video_url && (
                        <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">サムネイルURL</label>
                    <input
                        type="url"
                        value={data.thumbnail_url}
                        onChange={(e) => setData('thumbnail_url', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />
                    {errors.thumbnail_url && (
                        <p className="mt-1 text-sm text-red-600">{errors.thumbnail_url}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">状態</label>
                    <select
                        value={data.status}
                        onChange={(e) =>
                            setData('status', e.target.value as LessonForm['status'])
                        }
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    >
                        <option value="draft">下書き</option>
                        <option value="published">公開</option>
                        <option value="archived">非公開</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
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

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        更新する
                    </button>

                    <Link
                        href={route('admin.lessons.index')}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        戻る
                    </Link>
                </div>
            </form>
        </div>
    );
}