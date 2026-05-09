import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import type { LearningLogForm } from '@/types/learning-log';
import { LearningLogFormFields } from './form';

type Props = {
    log: LearningLogForm & {
        id: number;
    };
};

export default function StudentLearningLogsEdit({ log }: Props) {
    const { data, setData, put, processing, errors } = useForm<LearningLogForm>({
        log_date: log.log_date,
        did_text: log.did_text ?? '',
        understood_text: log.understood_text ?? '',
        difficult_text: log.difficult_text ?? '',
        question_text: log.question_text ?? '',
        mood: log.mood ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        put(route('student.learning-logs.update', log.id));
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

                <h1 className="mt-4 text-2xl font-bold">学習記録を編集</h1>
                <p className="mt-1 text-gray-600">
                    記録した内容を編集できます。
                </p>
            </div>

            <form onSubmit={submit}>
                <LearningLogFormFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submitLabel="更新する"
                />
            </form>
        </div>
    );
}