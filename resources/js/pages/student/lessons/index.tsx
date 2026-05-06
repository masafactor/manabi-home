import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { StudentLesson, StudentProfileSummary } from '@/types/student-lesson';

type Props = {
    lessons: StudentLesson[];
    profile: StudentProfileSummary | null;
};

export default function StudentLessonsIndex({ lessons, profile }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">授業一覧</h1>
                <p className="mt-1 text-gray-600">
                    自分の学年に合った授業動画を確認できます。
                </p>

                {profile && (
                    <p className="mt-2 text-sm text-gray-500">
                        対象：{profile.grade_label}
                    </p>
                )}

                {!profile && (
                    <p className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                        生徒プロフィールが未設定です。表示対象の授業を絞り込めません。
                    </p>
                )}
            </div>

            {lessons.length === 0 ? (
                <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
                    現在、表示できる授業はありません。
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {lessons.map((lesson) => (
                        <Link
                            key={lesson.id}
                            href={route('student.lessons.show', lesson.id)}
                            className="block rounded-lg border bg-white p-5 hover:bg-gray-50"
                        >
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                    {lesson.subject_name ?? '未設定'}
                                </span>

                                {lesson.is_completed ? (
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                        視聴完了
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                        これから
                                    </span>
                                )}
                            </div>

                            <h2 className="text-lg font-semibold">{lesson.title}</h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {lesson.grade_label}
                                {lesson.unit_name ? ` / ${lesson.unit_name}` : ''}
                            </p>

                            {lesson.description && (
                                <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                                    {lesson.description}
                                </p>
                            )}

                            {lesson.completed_at && (
                                <p className="mt-3 text-xs text-gray-500">
                                    完了日時：{lesson.completed_at}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}