import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function StudentDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">生徒ダッシュボード</h1>

            <p className="mt-4 text-gray-600">
                授業動画を見たり、小テストや学習記録を確認します。
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Link
                    href={route('student.lessons.index')}
                    className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                >
                    <h2 className="text-lg font-semibold">授業一覧</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        自分の学年に合った授業動画を確認します。
                    </p>
                </Link>

                <Link
                    href={route('student.learning-logs.index')}
                    className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                >
                    <h2 className="text-lg font-semibold">学習記録</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        今日できたことや、分かったことを記録します。
                    </p>
                </Link>
            </div>
        </div>
    );
}