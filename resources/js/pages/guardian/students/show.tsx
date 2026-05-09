import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type {
    GuardianLearningLog,
    GuardianLessonView,
    GuardianQuizAttempt,
    GuardianStudent,
    GuardianStudentSummary,
} from '@/types/guardian-student';

type Props = {
    student: GuardianStudent;
    summary: GuardianStudentSummary;
    lessonViews: GuardianLessonView[];
    quizAttempts: GuardianQuizAttempt[];
    learningLogs: GuardianLearningLog[];
};

export default function GuardianStudentsShow({
    student,
    summary,
    lessonViews,
    quizAttempts,
    learningLogs,
}: Props) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={route('guardian.students.index')}
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← 生徒一覧へ戻る
                </Link>

                <h1 className="mt-4 text-2xl font-bold">{student.name} さんの学習状況</h1>

                <p className="mt-1 text-gray-600">
                    {student.profile
                        ? `${student.profile.grade_label} / ${student.profile.school_name ?? '学校名未設定'}`
                        : 'プロフィール未設定'}
                </p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">視聴完了授業</p>
                    <p className="mt-2 text-2xl font-bold">
                        {summary.completed_lessons_count}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">確認テスト受験</p>
                    <p className="mt-2 text-2xl font-bold">
                        {summary.quiz_attempts_count}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">学習記録</p>
                    <p className="mt-2 text-2xl font-bold">
                        {summary.learning_logs_count}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-5">
                    <p className="text-sm text-gray-500">最新記録日</p>
                    <p className="mt-2 text-lg font-semibold">
                        {summary.latest_learning_log_date ?? '-'}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <section className="rounded-lg border bg-white p-6">
                    <h2 className="text-lg font-semibold">最近の視聴授業</h2>

                    {lessonViews.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            視聴記録はまだありません。
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {lessonViews.map((view) => (
                                <div key={view.id} className="rounded-md border p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {view.subject_name ?? '-'} / {view.lesson_title ?? '-'}
                                            </p>
                                            {view.unit_name && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {view.unit_name}
                                                </p>
                                            )}
                                        </div>

                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                            視聴完了
                                        </span>
                                    </div>

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
                    <h2 className="text-lg font-semibold">最近の確認テスト</h2>

                    {quizAttempts.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            確認テストの受験記録はまだありません。
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
                    <h2 className="text-lg font-semibold">最近の学習記録</h2>

                    {learningLogs.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            学習記録はまだありません。
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
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}