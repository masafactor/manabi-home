import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { QuizResult } from '@/types/student-quiz';

type Props = {
    attempt: QuizResult;
};

export default function StudentQuizResult({ attempt }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">小テスト結果</h1>
                <p className="mt-1 text-gray-600">
                    {attempt.quiz.subject_name ?? '-'} / {attempt.quiz.lesson_title}
                </p>
            </div>

            <div className="mb-6 rounded-lg border bg-white p-6">
                <h2 className="text-lg font-semibold">{attempt.quiz.title}</h2>

                <p className="mt-4 text-3xl font-bold">
                    {attempt.score} / {attempt.max_score} 点
                </p>

                <p className="mt-1 text-gray-600">
                    正答率：{attempt.percentage}%
                </p>

                {attempt.submitted_at && (
                    <p className="mt-1 text-sm text-gray-500">
                        提出日時：{attempt.submitted_at}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {attempt.answers.map((answer, index) => (
                    <div key={answer.id} className="rounded-lg border bg-white p-6">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="font-semibold">
                                Q{index + 1}. {answer.question_text}
                            </h3>

                            {answer.is_correct ? (
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                    正解
                                </span>
                            ) : (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                                    不正解
                                </span>
                            )}
                        </div>

                        <p className="mt-3 text-sm text-gray-600">
                            あなたの回答：{answer.selected_choice_text ?? '未回答'}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            得点：{answer.points_awarded} / {answer.points}
                        </p>

                        {answer.explanation && (
                            <p className="mt-3 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-700">
                                解説：{answer.explanation}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Link
                    href={route('student.lessons.index')}
                    className="rounded-md border px-4 py-2 text-sm"
                >
                    授業一覧へ戻る
                </Link>
            </div>
        </div>
    );
}