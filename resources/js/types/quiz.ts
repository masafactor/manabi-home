export type QuizStatus = 'draft' | 'published' | 'archived';

export type AdminQuiz = {
    id: number;
    title: string;
    lesson_title: string | null;
    subject_name: string | null;
    status: QuizStatus;
    passing_score: number | null;
    created_at: string | null;
};

export type LessonOption = {
    id: number;
    label: string;
};

export type QuizCreateForm = {
    lesson_id: number | '';
    title: string;
    description: string;
    passing_score: number | '';
    status: QuizStatus;
    question_text: string;
    explanation: string;
    points: number;
    choices: string[];
    correct_choice_index: number;
};