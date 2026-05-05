import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function AdminDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
            <p className="mt-4 text-gray-600">
                ユーザー管理、教科管理、授業管理などを行います。
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Link
                    href={route('admin.subjects.index')}
                    // href="/admin/subjects"
                    className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                >
                    <h2 className="text-lg font-semibold">教科管理</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        授業動画で使用する教科を登録・編集します。
                    </p>
                </Link>

                <Link
                    href={route('admin.lessons.index')}
                    className="rounded-lg border bg-white p-5 hover:bg-gray-50"
                >
                    <h2 className="text-lg font-semibold">授業動画管理</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        生徒が視聴する授業動画を登録・編集します。
                    </p>
                </Link>
            </div>
        </div>
    );
}