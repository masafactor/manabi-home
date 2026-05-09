export type Mood = '' | 'good' | 'normal' | 'tired' | 'hard';

export type LearningLog = {
    id: number;
    log_date: string;
    did_text: string | null;
    understood_text: string | null;
    difficult_text: string | null;
    question_text: string | null;
    mood: Mood;
    mood_label: string;
    created_at?: string;
};

export type LearningLogForm = {
    log_date: string;
    did_text: string;
    understood_text: string;
    difficult_text: string;
    question_text: string;
    mood: Mood;
};