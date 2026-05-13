import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { LearningLog } from '@/types/learning-log';

type Props = {
    logs: LearningLog[];
};

export default function StudentLearningLogsIndex({ logs }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">学習記録</h1>
                    <p className="mt-1 text-gray-600">
                        今日できたことや、分かったことを残します。
                    </p>
                </div>

                <Link
                    href={route('student.learning-logs.create')}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    記録を書く
                </Link>
            </div>

            {logs.length === 0 ? (
                <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
                    学習記録はまだありません。
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div key={log.id} className="rounded-lg border bg-white p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">{log.log_date}</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        気分：{log.mood_label}
                                    </p>
                                </div>

                                <Link
                                    href={route('student.learning-logs.edit', log.id)}
                                    className="rounded-md border px-3 py-1 text-sm"
                                >
                                    編集
                                </Link>
                            </div>

                            {log.did_text && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold">今日やったこと</h3>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                        {log.did_text}
                                    </p>
                                </div>
                            )}

                            {log.understood_text && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold">分かったこと</h3>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                        {log.understood_text}
                                    </p>
                                </div>
                            )}

                            {log.difficult_text && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold">難しかったこと</h3>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                        {log.difficult_text}
                                    </p>
                                </div>
                            )}

                            {log.question_text && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold">聞きたいこと</h3>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                        {log.question_text}
                                    </p>
                                </div>
                            )}

                            {log.comments.length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="text-sm font-semibold">先生コメント</h3>

                                    <div className="mt-3 space-y-2">
                                        {log.comments.map((comment) => (
                                            <div key={comment.id} className="rounded-md bg-gray-50 p-3">
                                                <p className="text-sm font-medium">
                                                    {comment.teacher_name ?? '先生'}
                                                </p>
                                                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                    {comment.comment}
                                                </p>
                                                {comment.created_at && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {comment.created_at}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                
                </div>
            )}
        </div>
    );
}