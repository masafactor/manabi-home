import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { AdminStudent } from '@/types/student';

type Props = {
    students: AdminStudent[];
};

export default function AdminStudentsIndex({ students }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">生徒管理</h1>
                <p className="mt-1 text-gray-600">
                    生徒の学校種別・学年などのプロフィールを管理します。
                </p>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b px-4 py-3">氏名</th>
                            <th className="border-b px-4 py-3">メールアドレス</th>
                            <th className="border-b px-4 py-3">学校種別・学年</th>
                            <th className="border-b px-4 py-3">学校名</th>
                            <th className="border-b px-4 py-3">登録日</th>
                            <th className="border-b px-4 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                    生徒ユーザーがまだ登録されていません。
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id}>
                                    <td className="border-b px-4 py-3 font-medium">
                                        {student.name}
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {student.email}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        {student.profile ? (
                                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                                {student.profile.grade_label}
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                                                未設定
                                            </span>
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {student.profile?.school_name ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {student.created_at ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <div className="flex justify-end">
                                            <Link
                                                href={route('admin.students.profile.edit', student.id)}
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                プロフィール編集
                                            </Link>
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