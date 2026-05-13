import { Link, useForm, router} from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { StudentProfileForm } from '@/types/student';

type GuardianOption = {
    id: number;
    name: string;
    email: string;
};

type Guardian = {
    id: number;
    name: string;
    email: string;
    relationship: string | null;
};

type Student = {
    id: number;
    name: string;
    email: string;
};

type TeacherOption = {
    id: number;
    name: string;
    email: string;
};

type Teacher = {
    id: number;
    name: string;
    email: string;
    relationship: string | null;
};

type Props = {
    student: Student;
    profile: StudentProfileForm;
    guardianOptions: GuardianOption[];
    guardians: Guardian[];
    teacherOptions: TeacherOption[];
    teachers: Teacher[];
};

export default function AdminStudentProfileEdit({ student, profile,guardianOptions,guardians,teacherOptions,
    teachers,
 }: Props) {
    const { data, setData, put, processing, errors } = useForm<StudentProfileForm>({
        school_stage: profile.school_stage,
        grade: profile.grade,
        school_name: profile.school_name ?? '',
        note: profile.note ?? '',
    });

    const {
        data: guardianData,
        setData: setGuardianData,
        post: postGuardian,
        processing: guardianProcessing,
        errors: guardianErrors,
    } = useForm({
        guardian_id: '',
        relationship: '',
    });

    const attachGuardian = (e: FormEvent) => {
    e.preventDefault();

    postGuardian(route('admin.students.guardians.attach', student.id), {
        preserveScroll: true,
    });
};

    const detachGuardian = (guardianId: number) => {
        router.delete(route('admin.students.guardians.detach', [student.id, guardianId]), {
            preserveScroll: true,
        });
    };
    const submit = (e: FormEvent) => {
        e.preventDefault();

        put(route('admin.students.profile.update', student.id));
    };

    const {
    data: teacherData,
    setData: setTeacherData,
    post: postTeacher,
    processing: teacherProcessing,
    errors: teacherErrors,
    } = useForm({
        teacher_id: '',
        relationship: '',
    });

    const attachTeacher = (e: FormEvent) => {
        e.preventDefault();

        postTeacher(route('admin.students.teachers.attach', student.id), {
            preserveScroll: true,
        });
    };

    const detachTeacher = (teacherId: number) => {
        router.delete(route('admin.students.teachers.detach', [student.id, teacherId]), {
            preserveScroll: true,
        });
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

                        <div className="mt-8 max-w-2xl rounded-lg border bg-white p-6">
                <h2 className="text-lg font-semibold">保護者紐づけ</h2>
                <p className="mt-1 text-sm text-gray-600">
                    この生徒の学習状況を確認できる保護者を設定します。
                </p>

                <div className="mt-5">
                    <h3 className="text-sm font-semibold">現在の保護者</h3>

                    {guardians.length === 0 ? (
                        <p className="mt-3 text-sm text-gray-500">
                            紐づいている保護者はまだいません。
                        </p>
                    ) : (
                        <div className="mt-3 space-y-3">
                            {guardians.map((guardian) => (
                                <div
                                    key={guardian.id}
                                    className="flex items-center justify-between gap-4 rounded-md border p-3"
                                >
                                    <div>
                                        <p className="font-medium">{guardian.name}</p>
                                        <p className="text-sm text-gray-500">{guardian.email}</p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            関係性：{guardian.relationship ?? '未設定'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => detachGuardian(guardian.id)}
                                        className="rounded-md border px-3 py-1 text-sm text-red-600"
                                    >
                                        解除
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <form onSubmit={attachGuardian} className="mt-6 space-y-4 border-t pt-5">
                    <h3 className="text-sm font-semibold">保護者を追加</h3>

                    <div>
                        <label className="block text-sm font-medium">保護者ユーザー</label>
                        <select
                            value={guardianData.guardian_id}
                            onChange={(e) => setGuardianData('guardian_id', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">選択してください</option>
                            {guardianOptions.map((guardian) => (
                                <option key={guardian.id} value={guardian.id}>
                                    {guardian.name}（{guardian.email}）
                                </option>
                            ))}
                        </select>
                        {guardianErrors.guardian_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {guardianErrors.guardian_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">関係性</label>
                        <input
                            type="text"
                            value={guardianData.relationship}
                            onChange={(e) => setGuardianData('relationship', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="例：母、父、祖母、支援者"
                        />
                        {guardianErrors.relationship && (
                            <p className="mt-1 text-sm text-red-600">
                                {guardianErrors.relationship}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={guardianProcessing}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        保護者を紐づける
                    </button>
                </form>

                
            </div>
            <div className="mt-8 max-w-2xl rounded-lg border bg-white p-6">
                <h2 className="text-lg font-semibold">先生・支援者紐づけ</h2>
                <p className="mt-1 text-sm text-gray-600">
                    この生徒の学習状況を確認できる先生・支援者を設定します。
                </p>

                <div className="mt-5">
                    <h3 className="text-sm font-semibold">現在の担当者</h3>

                    {teachers.length === 0 ? (
                        <p className="mt-3 text-sm text-gray-500">
                            紐づいている先生・支援者はまだいません。
                        </p>
                    ) : (
                        <div className="mt-3 space-y-3">
                            {teachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    className="flex items-center justify-between gap-4 rounded-md border p-3"
                                >
                                    <div>
                                        <p className="font-medium">{teacher.name}</p>
                                        <p className="text-sm text-gray-500">{teacher.email}</p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            関係性：{teacher.relationship ?? '未設定'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => detachTeacher(teacher.id)}
                                        className="rounded-md border px-3 py-1 text-sm text-red-600"
                                    >
                                        解除
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <form onSubmit={attachTeacher} className="mt-6 space-y-4 border-t pt-5">
                    <h3 className="text-sm font-semibold">先生・支援者を追加</h3>

                    <div>
                        <label className="block text-sm font-medium">先生・支援者ユーザー</label>
                        <select
                            value={teacherData.teacher_id}
                            onChange={(e) => setTeacherData('teacher_id', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="">選択してください</option>
                            {teacherOptions.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}（{teacher.email}）
                                </option>
                            ))}
                        </select>
                        {teacherErrors.teacher_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {teacherErrors.teacher_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">関係性</label>
                        <input
                            type="text"
                            value={teacherData.relationship}
                            onChange={(e) => setTeacherData('relationship', e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="例：担任、支援担当、数学担当"
                        />
                        {teacherErrors.relationship && (
                            <p className="mt-1 text-sm text-red-600">
                                {teacherErrors.relationship}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={teacherProcessing}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        先生・支援者を紐づける
                    </button>
                </form>
            </div>
        </div>
    );
}