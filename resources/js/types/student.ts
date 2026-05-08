export type StudentProfile = {
    school_stage: string;
    school_stage_label: string;
    grade: number | null;
    grade_label: string;
    school_name: string | null;
};

export type AdminStudent = {
    id: number;
    name: string;
    email: string;
    profile: StudentProfile | null;
    created_at?: string;
};

export type StudentProfileForm = {
    school_stage: 'elementary' | 'junior_high' | 'high_school';
    grade: number | '';
    school_name: string;
    note: string;
};