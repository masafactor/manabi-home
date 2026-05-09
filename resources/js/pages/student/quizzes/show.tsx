import { Link, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { StudentQuiz } from '@/types/student-quiz';

type Props = {
    quiz: StudentQuiz;
};

export default function StudentQuizShow({ quiz }: Props) {
    const { data, setData, processing, errors } = useForm<{
        answers: Record<number, number>;
    }>({
        answers: {},
    });

    const answerErrors = errors as Record<string, string | undefined>;

    const selectAnswer = (questionId: number, choiceId: number) => {
        setData('answers', {
            ...data.answers,
            [questionId]: choiceId,
        });
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.post(route('student.quizzes.submit', quiz.id), data);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={route('student.lessons.index')}
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← 授業一覧へ戻る
                </Link>

                <h1 className="mt-4 text-2xl font-bold">{quiz.title}</h1>
                <p className="mt-1 text-gray-600">
                    {quiz.subject_name ?? '-'} / {quiz.lesson_title}
                </p>

                {quiz.description && (
                    <p className="mt-3 text-gray-600">{quiz.description}</p>
                )}
            </div>

            <form onSubmit={submit} className="space-y-6">
                {quiz.questions.map((question, index) => (
                    <div key={question.id} className="rounded-lg border bg-white p-6">
                        <h2 className="font-semibold">
                            Q{index + 1}. {question.question_text}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            配点：{question.points}点
                        </p>

                        <div className="mt-4 space-y-3">
                            {question.choices.map((choice) => (
                                <label
                                    key={choice.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={data.answers[question.id] === choice.id}
                                        onChange={() => selectAnswer(question.id, choice.id)}
                                    />
                                    <span>{choice.choice_text}</span>
                                </label>
                            ))}
                        </div>

                      
                      {answerErrors[`answers.${question.id}`] && (
                            <p className="mt-2 text-sm text-red-600">
                                {answerErrors[`answers.${question.id}`]}
                            </p>
                        )}
                    </div>
                ))}

                {errors.answers && (
                    <p className="text-sm text-red-600">{errors.answers}</p>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    提出する
                </button>
            </form>
        </div>
    );
}