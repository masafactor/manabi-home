export type StudentQuiz = {
    id: number;
    title: string;
    description: string | null;
    lesson_title: string;
    subject_name: string | null;
    questions: {
        id: number;
        question_text: string;
        points: number;
        choices: {
            id: number;
            choice_text: string;
        }[];
    }[];
};

export type QuizResult = {
    id: number;
    score: number;
    max_score: number;
    percentage: number;
    submitted_at: string | null;
    quiz: {
        title: string;
        lesson_title: string | null;
        subject_name: string | null;
    };
    answers: {
        id: number;
        question_text: string;
        selected_choice_text: string | null;
        is_correct: boolean;
        points_awarded: number;
        points: number;
        explanation: string | null;
        choices: {
            id: number;
            choice_text: string;
            is_correct: boolean;
        }[];
    }[];
};