import type { AdminUserForm, RoleOption } from '@/types/admin-user';

type Props = {
    data: AdminUserForm;
    setData: <K extends keyof AdminUserForm>(key: K, value: AdminUserForm[K]) => void;
    errors: Partial<Record<keyof AdminUserForm, string>>;
    processing: boolean;
    roleOptions: RoleOption[];
    submitLabel: string;
    passwordHelpText: string;
};

export function AdminUserFormFields({
    data,
    setData,
    errors,
    processing,
    roleOptions,
    submitLabel,
    passwordHelpText,
}: Props) {
    return (
        <div className="max-w-2xl space-y-5 rounded-lg border bg-white p-6">
            <div>
                <label className="block text-sm font-medium">氏名</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="例：山田 太郎"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">メールアドレス</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="example@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">ロール</label>
                <select
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value as AdminUserForm['role'])}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                >
                    {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
                {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">パスワード</label>
                <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="8文字以上"
                />
                <p className="mt-1 text-xs text-gray-500">{passwordHelpText}</p>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </div>
    );
}