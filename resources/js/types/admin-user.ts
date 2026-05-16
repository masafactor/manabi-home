export type UserRole = 'admin' | 'teacher' | 'student' | 'guardian';

export type RoleOption = {
    value: UserRole;
    label: string;
};

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    role_label: string;
    created_at: string | null;
};

export type AdminUserForm = {
    name: string;
    email: string;
    role: UserRole;
    password: string;
};