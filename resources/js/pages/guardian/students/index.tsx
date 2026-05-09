import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { GuardianStudent } from '@/types/guardian-student';

type Props = {
    students: GuardianStudent[];
};

export default function GuardianStudentsIndex({ students }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">生徒の学習状況</h1>
                <p className="mt-1 text-gray-600">
                    紐づいている生徒の学習状況を確認できます。
                </p>
            </div>

            {students.length === 0 ? (
                <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
                    確認できる生徒がまだ紐づいていません。
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {students.map((student) => (
                        <Link
                            key={student.id}
                            href={route('guardian.students.show', student.id)}
                            className="block rounded-lg border bg-white p-5 hover:bg-gray-50"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">{student.name}</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {student.email}
                                    </p>
                                </div>

                                {student.relationship && (
                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                        {student.relationship}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4">
                                {student.profile ? (
                                    <>
                                        <p className="text-sm text-gray-700">
                                            {student.profile.grade_label}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {student.profile.school_name ?? '学校名未設定'}
                                        </p>
                                    </>
                                ) : (
                                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                                        プロフィール未設定
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}