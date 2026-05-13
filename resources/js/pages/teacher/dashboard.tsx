import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function TeacherDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">先生・支援者ダッシュボード</h1>

            <p className="mt-4 text-gray-600">
                担当生徒の学習状況を確認します。
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Link
                    href={route('teacher.students.index')}
                    className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                >
                    <h2 className="text-lg font-semibold">担当生徒一覧</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        授業視聴、確認テスト、学習記録を確認します。
                    </p>
                </Link>
            </div>
        </div>
    );
}