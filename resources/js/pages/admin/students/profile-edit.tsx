import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { StudentProfileForm } from '@/types/student';

type Student = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    student: Student;
    profile: StudentProfileForm;
};

export default function AdminStudentProfileEdit({ student, profile }: Props) {
    const { data, setData, put, processing, errors } = useForm<StudentProfileForm>({
        school_stage: profile.school_stage,
        grade: profile.grade,
        school_name: profile.school_name ?? '',
        note: profile.note ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        put(route('admin.students.profile.update', student.id));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={route('admin.students.index')}
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← 生徒一覧へ戻る
                </Link>

                <h1 className="mt-4 text-2xl font-bold">生徒プロフィール編集</h1>
                <p className="mt-1 text-gray-600">
                    {student.name}（{student.email}）の学校種別・学年を設定します。
                </p>
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-lg border bg-white p-6">
                <div>
                    <label className="block text-sm font-medium">学校種別</label>
                    <select
                        value={data.school_stage}
                        onChange={(e) =>
                            setData(
                                'school_stage',
                                e.target.value as StudentProfileForm['school_stage'],
                            )
                        }
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    >
                        <option value="elementary">小学校</option>
                        <option value="junior_high">中学校</option>
                        <option value="high_school">高校</option>
                    </select>
                    {errors.school_stage && (
                        <p className="mt-1 text-sm text-red-600">{errors.school_stage}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">学年</label>
                    <input
                        type="number"
                        min="1"
                        max="6"
                        value={data.grade}
                        onChange={(e) =>
                            setData('grade', e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        placeholder="例：1"
                    />
                    {errors.grade && (
                        <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">学校名</label>
                    <input
                        type="text"
                        value={data.school_name}
                        onChange={(e) => setData('school_name', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        placeholder="例：サンプル中学校"
                    />
                    {errors.school_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.school_name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">備考</label>
                    <textarea
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                        className="mt-1 min-h-32 w-full rounded-md border px-3 py-2"
                        placeholder="支援上のメモなどを入力します。"
                    />
                    {errors.note && (
                        <p className="mt-1 text-sm text-red-600">{errors.note}</p>
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
                        href={route('admin.students.index')}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        戻る
                    </Link>
                </div>
            </form>
        </div>
    );
}