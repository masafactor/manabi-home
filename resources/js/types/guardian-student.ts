export type GuardianStudentProfile = {
    school_stage: string;
    school_stage_label: string;
    grade: number | null;
    grade_label: string;
    school_name: string | null;
};

export type GuardianStudent = {
    id: number;
    name: string;
    email: string;
    relationship: string | null;
    profile: GuardianStudentProfile | null;
};

export type GuardianStudentSummary = {
    completed_lessons_count: number;
    quiz_attempts_count: number;
    learning_logs_count: number;
    latest_learning_log_date: string | null;
};

export type GuardianLessonView = {
    id: number;
    lesson_title: string | null;
    subject_name: string | null;
    unit_name: string | null;
    is_completed: boolean;
    completed_at: string | null;
    memo: string | null;
};

export type GuardianQuizAttempt = {
    id: number;
    quiz_title: string | null;
    lesson_title: string | null;
    subject_name: string | null;
    score: number;
    max_score: number;
    percentage: number;
    submitted_at: string | null;
};

export type GuardianLearningLog = {
    id: number;
    log_date: string;
    did_text: string | null;
    understood_text: string | null;
    difficult_text: string | null;
    question_text: string | null;
    mood: string | null;
    mood_label: string;
};