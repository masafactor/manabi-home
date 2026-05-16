import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { AdminUser } from '@/types/admin-user';

type Props = {
    users: AdminUser[];
};

export default function AdminUsersIndex({ users }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">ユーザー管理</h1>
                    <p className="mt-1 text-gray-600">
                        管理者・先生・生徒・保護者ユーザーを管理します。
                    </p>
                </div>

                <Link
                    href={route('admin.users.create')}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    ユーザーを追加
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b px-4 py-3">氏名</th>
                            <th className="border-b px-4 py-3">メールアドレス</th>
                            <th className="border-b px-4 py-3">ロール</th>
                            <th className="border-b px-4 py-3">登録日</th>
                            <th className="border-b px-4 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                    ユーザーがまだ登録されていません。
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="border-b px-4 py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                            {user.role_label}
                                        </span>
                                    </td>
                                    <td className="border-b px-4 py-3 text-gray-600">
                                        {user.created_at ?? '-'}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <div className="flex justify-end">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="rounded-md border px-3 py-1 text-sm"
                                            >
                                                編集
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