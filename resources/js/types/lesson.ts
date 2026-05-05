export type LessonStatus = 'draft' | 'published' | 'archived';

export type Lesson = {
    id: number;
    subject_name: string | null;
    teacher_name: string | null;
    grade: number | null;
    unit_name: string | null;
    title: string;
    video_url: string;
    thumbnail_url: string | null;
    status: LessonStatus;
    published_at: string | null;
    sort_order: number;
    created_at?: string;
};

export type LessonForm = {
    subject_id: number | '';
    grade: number | '';
    unit_name: string;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    status: LessonStatus;
    sort_order: number;
};

export type SubjectOption = {
    id: number;
    name: string;
};