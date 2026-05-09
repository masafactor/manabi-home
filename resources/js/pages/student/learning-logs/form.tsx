import type { LearningLogForm, Mood } from '@/types/learning-log';

type Props = {
    data: LearningLogForm;
    setData: <K extends keyof LearningLogForm>(key: K, value: LearningLogForm[K]) => void;
    errors: Partial<Record<keyof LearningLogForm, string>>;
    processing: boolean;
    submitLabel: string;
};

const moodOptions: { value: Mood; label: string }[] = [
    { value: '', label: '未選択' },
    { value: 'good', label: 'よい' },
    { value: 'normal', label: 'ふつう' },
    { value: 'tired', label: 'つかれた' },
    { value: 'hard', label: 'しんどい' },
];

export function LearningLogFormFields({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: Props) {
    return (
        <div className="max-w-2xl space-y-5 rounded-lg border bg-white p-6">
            <div>
                <label className="block text-sm font-medium">学習日</label>
                <input
                    type="date"
                    value={data.log_date}
                    onChange={(e) => setData('log_date', e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                />
                {errors.log_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.log_date}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">今日やったこと</label>
                <textarea
                    value={data.did_text}
                    onChange={(e) => setData('did_text', e.target.value)}
                    className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
                    placeholder="例：数学の授業動画を1本見た。確認テストを受けた。"
                />
                {errors.did_text && (
                    <p className="mt-1 text-sm text-red-600">{errors.did_text}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">分かったこと</label>
                <textarea
                    value={data.understood_text}
                    onChange={(e) => setData('understood_text', e.target.value)}
                    className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
                    placeholder="例：正負の数の考え方が少し分かった。"
                />
                {errors.understood_text && (
                    <p className="mt-1 text-sm text-red-600">{errors.understood_text}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">難しかったこと</label>
                <textarea
                    value={data.difficult_text}
                    onChange={(e) => setData('difficult_text', e.target.value)}
                    className="mt-1 min-h-28 w-full rounded-md border px-3 py-2"
                    placeholder="例：マイナス同士の計算が少し難しかった。"
                />
                {errors.difficult_text && (
                    <p className="mt-1 text-sm text-red-600">{errors.difficult_text}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">聞きたいこと</label>
                <textarea
                    value={data.question_text}
                    onChange={(e) => setData('question_text', e.target.value)}
                    className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
                    placeholder="先生や支援者に聞きたいことがあれば書きます。"
                />
                {errors.question_text && (
                    <p className="mt-1 text-sm text-red-600">{errors.question_text}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">今日の気分</label>
                <select
                    value={data.mood}
                    onChange={(e) => setData('mood', e.target.value as Mood)}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                >
                    {moodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.mood && (
                    <p className="mt-1 text-sm text-red-600">{errors.mood}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </div>
    );
}