import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { AdminUserForm, RoleOption } from '@/types/admin-user';
import { AdminUserFormFields } from './form';

type Props = {
    roleOptions: RoleOption[];
};

export default function AdminUsersCreate({ roleOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm<AdminUserForm>({
        name: '',
        email: '',
        role: 'student',
        password: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'));
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

                <h1 className="mt-4 text-2xl font-bold">ユーザー登録</h1>
                <p className="mt-1 text-gray-600">
                    管理者・先生・生徒・保護者ユーザーを追加します。
                </p>
            </div>

            <form onSubmit={submit}>
                <AdminUserFormFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    roleOptions={roleOptions}
                    submitLabel="登録する"
                    passwordHelpText="新規登録時はパスワードが必須です。"
                />
            </form>
        </div>
    );
}