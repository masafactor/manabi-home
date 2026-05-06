export type StudentLesson = {
    id: number;
    subject_name: string | null;
    school_stage: string;
    school_stage_label: string;
    grade: number | null;
    grade_label: string;
    unit_name: string | null;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    published_at: string | null;
    is_completed: boolean;
    completed_at: string | null;
};

export type StudentLessonDetail = {
    id: number;
    subject_name: string | null;
    school_stage_label: string;
    grade_label: string;
    unit_name: string | null;
    title: string;
    description: string | null;
    video_url: string;
    thumbnail_url: string | null;
    published_at: string | null;
    is_completed: boolean;
    completed_at: string | null;
    memo: string | null;
};

export type StudentProfileSummary = {
    school_stage: string;
    school_stage_label: string;
    grade: number | null;
    grade_label: string;
};