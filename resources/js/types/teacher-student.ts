export type TeacherStudentProfile = {
    school_stage: string;
    school_stage_label: string;
    grade: number | null;
    grade_label: string;
    school_name: string | null;
};

export type TeacherStudent = {
    id: number;
    name: string;
    email: string;
    relationship: string | null;
    profile: TeacherStudentProfile | null;
};

export type TeacherStudentSummary = {
    completed_lessons_count: number;
    quiz_attempts_count: number;
    learning_logs_count: number;
    latest_learning_log_date: string | null;
};

export type TeacherLessonView = {
    id: number;
    lesson_title: string | null;
    subject_name: string | null;
    unit_name: string | null;
    is_completed: boolean;
    completed_at: string | null;
    memo: string | null;
};

export type TeacherQuizAttempt = {
    id: number;
    quiz_title: string | null;
    lesson_title: string | null;
    subject_name: string | null;
    score: number;
    max_score: number;
    percentage: number;
    submitted_at: string | null;
};

export type TeacherLearningLog = {
    id: number;
    log_date: string;
    did_text: string | null;
    understood_text: string | null;
    difficult_text: string | null;
    question_text: string | null;
    mood: string | null;
    mood_label: string;
    comments: {
        id: number;
        teacher_name: string | null;
        comment: string;
        created_at: string | null;
        can_delete: boolean;
    }[];
};