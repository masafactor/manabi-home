import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { AdminUserForm, RoleOption, UserRole } from '@/types/admin-user';
import { AdminUserFormFields } from './form';

type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
};

type Props = {
    user: User;
    roleOptions: RoleOption[];
};

export default function AdminUsersEdit({ user, roleOptions }: Props) {
    const { data, setData, put, processing, errors } = useForm<AdminUserForm>({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={route('admin.users.index')}
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← ユーザー一覧へ戻る
                </Link>

                <h1 className="mt-4 text-2xl font-bold">ユーザー編集</h1>
                <p className="mt-1 text-gray-600">
                    {user.name} のユーザー情報を編集します。
                </p>
            </div>

            <form onSubmit={submit}>
                <AdminUserFormFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    roleOptions={roleOptions}
                    submitLabel="更新する"
                    passwordHelpText="変更しない場合は空欄のままにしてください。"
                />
            </form>
        </div>
    );
}