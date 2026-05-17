import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type {
    MonthlyReportLearningLog,
    MonthlyReportLessonView,
    MonthlyReportQuizAttempt,
    MonthlyReportStudent,
    MonthlyReportSummary,
} from '@/types/monthly-report';

type Props = {
    student: MonthlyReportStudent;
    month: string;
    monthLabel: string;
    summary: MonthlyReportSummary;
    lessonViews: MonthlyReportLessonView[];
    quizAttempts: MonthlyReportQuizAttempt[];
    learningLogs: MonthlyReportLearningLog[];
};

export default function StudentMonthlyReportShow({
    student,
    month,
    monthLabel,
    summary,
    lessonViews,
    quizAttempts,
    learningLogs,
}: Props) {
    const changeMonth = (value: string) => {
        router.get(
            route('student.monthly-report'),
            { month: value },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={route('student.dashboard')}
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← ダッシュボードへ戻る
                </Link>
                <a
                    href={`${route('student.monthly-report.pdf')}?month=${month}`}
                    className="inline-flex rounded-md border px-4 py-2 text-sm"
                >
                    PDF出力
                </a>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {student.name} さんの月次レポート
                        </h1>
                        <p className="mt-1 text-gray-600">
                            {student.profile
                                ? `${student.profile.grade_label} / ${student.profile.school_name ?? '学校名未設定'}`
                                : 'プロフィール未設定'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">対象月</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => changeMonth(e.target.value)}
                            className="mt-1 rounded-md border px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6 rounded-lg border bg-white p-6">
                <h2 className="text-lg font-semibold">{monthLabel} のまとめ</h2>

                <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">視聴完了授業</p>
                        <p className="mt-2 text-2xl font-bold">
                            {summary.completed_lessons_count}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">確認テスト</p>
                        <p className="mt-2 text-2xl font-bold">
                            {summary.quiz_attempts_count}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">学習記録</p>
                        <p className="mt-2 text-2xl font-bold">
                            {summary.learning_logs_count}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">先生コメント</p>
                        <p className="mt-2 text-2xl font-bold">
                            {summary.teacher_comments_count}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">平均正答率</p>
                        <p className="mt-2 text-2xl font-bold">
                            {summary.average_score !== null ? `${summary.average_score}%` : '-'}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-gray-500">最高正答率</p>
                        <p className="mt-2 text-2xl font-bold">
                            {summary.best_score !== null ? `${summary.best_score}%` : '-'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <section className="rounded-lg border bg-white p-6">
                    <h2 className="text-lg font-semibold">視聴完了した授業</h2>

                    {lessonViews.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            この月の視聴完了授業はありません。
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {lessonViews.map((view) => (
                                <div key={view.id} className="rounded-md border p-4">
                                    <p className="font-medium">
                                        {view.subject_name ?? '-'} / {view.lesson_title ?? '-'}
                                    </p>

                                    {view.unit_name && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {view.unit_name}
                                        </p>
                                    )}

                                    {view.completed_at && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            完了日時：{view.completed_at}
                                        </p>
                                    )}

                                    {view.memo && (
                                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                            メモ：{view.memo}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-lg border bg-white p-6">
                    <h2 className="text-lg font-semibold">確認テスト結果</h2>

                    {quizAttempts.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            この月の確認テスト受験記録はありません。
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {quizAttempts.map((attempt) => (
                                <div key={attempt.id} className="rounded-md border p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {attempt.quiz_title ?? '-'}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {attempt.subject_name ?? '-'} / {attempt.lesson_title ?? '-'}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                            {attempt.score} / {attempt.max_score} 点
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm text-gray-500">
                                        正答率：{attempt.percentage}%
                                        {attempt.submitted_at && ` / 提出日時：${attempt.submitted_at}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-lg border bg-white p-6">
                    <h2 className="text-lg font-semibold">学習記録</h2>

                    {learningLogs.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            この月の学習記録はありません。
                        </p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {learningLogs.map((log) => (
                                <div key={log.id} className="rounded-md border p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-medium">{log.log_date}</p>
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                            気分：{log.mood_label}
                                        </span>
                                    </div>

                                    {log.did_text && (
                                        <div className="mt-3">
                                            <p className="text-sm font-semibold">今日やったこと</p>
                                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                {log.did_text}
                                            </p>
                                        </div>
                                    )}

                                    {log.understood_text && (
                                        <div className="mt-3">
                                            <p className="text-sm font-semibold">分かったこと</p>
                                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                {log.understood_text}
                                            </p>
                                        </div>
                                    )}

                                    {log.difficult_text && (
                                        <div className="mt-3">
                                            <p className="text-sm font-semibold">難しかったこと</p>
                                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                {log.difficult_text}
                                            </p>
                                        </div>
                                    )}

                                    {log.question_text && (
                                        <div className="mt-3">
                                            <p className="text-sm font-semibold">聞きたいこと</p>
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
                                                    <div
                                                        key={comment.id}
                                                        className="rounded-md bg-gray-50 p-3"
                                                    >
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
                </section>
            </div>
        </div>
    );
}