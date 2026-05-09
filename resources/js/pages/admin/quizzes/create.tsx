import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { LessonOption, QuizCreateForm } from '@/types/quiz';

type Props = {
    lessons: LessonOption[];
};

export default function AdminQuizzesCreate({ lessons }: Props) {
    const { data, setData, post, processing, errors } = useForm<QuizCreateForm>({
        lesson_id: '',
        title: '',
        description: '',
        passing_score: '',
        status: 'draft',
        question_text: '',
        explanation: '',
        points: 1,
        choices: ['', '', '', ''],
        correct_choice_index: 0,
    });

    const setChoice = (index: number, value: string) => {
        const nextChoices = [...data.choices];
        nextChoices[index] = value;
        setData('choices', nextChoices);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.quizzes.store'));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">小テスト登録</h1>
                <p className="mt-1 text-gray-600">
                    授業動画に紐づく確認用の小テストを登録します。
                </p>
            </div>

            <form onSubmit={submit} className="max-w-3xl space-y-6 rounded-lg border bg-white p-6">
                <div>
                    <label className="block text-sm font-medium">対象授業</label>
                    <select
                        value={data.lesson_id}
                        onChange={(e) => setData('lesson_id', Number(e.target.value))}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    >
                        <option value="">選択してください</option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.label}
                            </option>
                        ))}
                    </select>
                    {errors.lesson_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.lesson_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">小テストタイトル</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        placeholder="例：正負の数 確認テスト"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">説明</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium">合格点</label>
                        <input
                            type="number"
                            min="0"
                            value={data.passing_score}
                            onChange={(e) =>
                                setData(
                                    'passing_score',
                                    e.target.value === '' ? '' : Number(e.target.value),
                                )
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                        {errors.passing_score && (
                            <p className="mt-1 text-sm text-red-600">{errors.passing_score}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">配点</label>
                        <input
                            type="number"
                            min="1"
                            value={data.points}
                            onChange={(e) => setData('points', Number(e.target.value))}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                        {errors.points && (
                            <p className="mt-1 text-sm text-red-600">{errors.points}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">状態</label>
                        <select
                            value={data.status}
                            onChange={(e) =>
                                setData('status', e.target.value as QuizCreateForm['status'])
                            }
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        >
                            <option value="draft">下書き</option>
                            <option value="published">公開</option>
                            <option value="archived">非公開</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <h2 className="text-lg font-semibold">問題</h2>

                    <div className="mt-4">
                        <label className="block text-sm font-medium">問題文</label>
                        <textarea
                            value={data.question_text}
                            onChange={(e) => setData('question_text', e.target.value)}
                            className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
                        />
                        {errors.question_text && (
                            <p className="mt-1 text-sm text-red-600">{errors.question_text}</p>
                        )}
                    </div>

                    <div className="mt-4 space-y-3">
                        <label className="block text-sm font-medium">選択肢</label>

                        {data.choices.map((choice, index) => (
                            <div key={index} className="flex gap-3">
                                <label className="flex items-center gap-2 whitespace-nowrap text-sm">
                                    <input
                                        type="radio"
                                        checked={data.correct_choice_index === index}
                                        onChange={() => setData('correct_choice_index', index)}
                                    />
                                    正解
                                </label>

                                <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => setChoice(index, e.target.value)}
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder={`選択肢${index + 1}`}
                                />
                            </div>
                        ))}

                        {errors.choices && (
                            <p className="text-sm text-red-600">{errors.choices}</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium">解説</label>
                        <textarea
                            value={data.explanation}
                            onChange={(e) => setData('explanation', e.target.value)}
                            className="mt-1 min-h-20 w-full rounded-md border px-3 py-2"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        登録する
                    </button>

                    <Link
                        href={route('admin.quizzes.index')}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        戻る
                    </Link>
                </div>
            </form>
        </div>
    );
}