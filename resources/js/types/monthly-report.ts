export type MonthlyReportStudent = {
    id: number;
    name: string;
    email: string;
    profile: {
        grade_label: string;
        school_name: string | null;
    } | null;
};

export type MonthlyReportSummary = {
    completed_lessons_count: number;
    quiz_attempts_count: number;
    learning_logs_count: number;
    teacher_comments_count: number;
    average_score: number | null;
    best_score: number | null;
};

export type MonthlyReportLessonView = {
    id: number;
    lesson_title: string | null;
    subject_name: string | null;
    unit_name: string | null;
    completed_at: string | null;
    memo: string | null;
};

export type MonthlyReportQuizAttempt = {
    id: number;
    quiz_title: string | null;
    lesson_title: string | null;
    subject_name: string | null;
    score: number;
    max_score: number;
    percentage: number;
    submitted_at: string | null;
};

export type MonthlyReportLearningLog = {
    id: number;
    log_date: string;
    did_text: string | null;
    understood_text: string | null;
    difficult_text: string | null;
    question_text: string | null;
    mood_label: string;
    comments: {
        id: number;
        teacher_name: string | null;
        comment: string;
        created_at: string | null;
    }[];
};