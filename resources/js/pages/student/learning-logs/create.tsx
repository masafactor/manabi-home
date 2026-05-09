import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { LearningLogForm } from '@/types/learning-log';
import { LearningLogFormFields } from './form';

type Props = {
    defaultDate: string;
};

export default function StudentLearningLogsCreate({ defaultDate }: Props) {
    const { data, setData, post, processing, errors } = useForm<LearningLogForm>({
        log_date: defaultDate,
        did_text: '',
        understood_text: '',
        difficult_text: '',
        question_text: '',
        mood: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('student.learning-logs.store'));
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={route('student.learning-logs.index')}
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← 学習記録へ戻る
                </Link>

                <h1 className="mt-4 text-2xl font-bold">学習記録を書く</h1>
                <p className="mt-1 text-gray-600">
                    今日できたことや、分かったことを残します。
                </p>
            </div>

            <form onSubmit={submit}>
                <LearningLogFormFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submitLabel="保存する"
                />
            </form>
        </div>
    );
}