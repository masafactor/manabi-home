<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>月次レポート</title>
    <style>


       
       @font-face {
            font-family: 'NotoSansJP';
            src: url("{{ storage_path('fonts/NotoSansJP-Medium.ttf') }}") format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'NotoSansJP';
            src: url("{{ storage_path('fonts/NotoSansJP-SemiBold.ttf') }}") format('truetype');
            font-weight: bold;
            font-style: normal;
        }

        body {
            font-family: 'NotoSansJP', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #111;
        }

        h1 {
            font-size: 22px;
            margin-bottom: 4px;
        }

        h2 {
            font-size: 16px;
            margin-top: 24px;
            border-bottom: 1px solid #999;
            padding-bottom: 4px;
        }

        h3 {
            font-size: 13px;
            margin-bottom: 4px;
        }

         h1, h2, h3, strong, th {
        font-weight: bold;
        }

        .meta {
            color: #555;
            margin-bottom: 16px;
        }

        .summary {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        .summary th,
        .summary td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }

        .summary th {
            background: #f2f2f2;
        }

        .box {
            border: 1px solid #ddd;
            padding: 10px;
            margin-top: 10px;
        }

        .small {
            color: #666;
            font-size: 11px;
        }

        .pre {
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <h1>{{ $report['student']['name'] }} さんの月次レポート</h1>

    <div class="meta">
        対象月：{{ $report['monthLabel'] }}<br>
        @if ($report['student']['profile'])
            {{ $report['student']['profile']['grade_label'] }}
            /
            {{ $report['student']['profile']['school_name'] ?? '学校名未設定' }}
        @else
            プロフィール未設定
        @endif
    </div>

    <h2>月のまとめ</h2>

    <table class="summary">
        <tr>
            <th>視聴完了授業</th>
            <td>{{ $report['summary']['completed_lessons_count'] }} 件</td>
            <th>確認テスト</th>
            <td>{{ $report['summary']['quiz_attempts_count'] }} 回</td>
        </tr>
        <tr>
            <th>学習記録</th>
            <td>{{ $report['summary']['learning_logs_count'] }} 件</td>
            <th>先生コメント</th>
            <td>{{ $report['summary']['teacher_comments_count'] }} 件</td>
        </tr>
        <tr>
            <th>平均正答率</th>
            <td>
                {{ $report['summary']['average_score'] !== null ? $report['summary']['average_score'] . '%' : '-' }}
            </td>
            <th>最高正答率</th>
            <td>
                {{ $report['summary']['best_score'] !== null ? $report['summary']['best_score'] . '%' : '-' }}
            </td>
        </tr>
    </table>

    <h2>視聴完了した授業</h2>

    @forelse ($report['lessonViews'] as $view)
        <div class="box">
            <h3>{{ $view['subject_name'] ?? '-' }} / {{ $view['lesson_title'] ?? '-' }}</h3>

            @if ($view['unit_name'])
                <div class="small">単元：{{ $view['unit_name'] }}</div>
            @endif

            @if ($view['completed_at'])
                <div class="small">完了日時：{{ $view['completed_at'] }}</div>
            @endif

            @if ($view['memo'])
                <p class="pre">メモ：{{ $view['memo'] }}</p>
            @endif
        </div>
    @empty
        <p class="small">この月の視聴完了授業はありません。</p>
    @endforelse

    <h2>確認テスト結果</h2>

    @forelse ($report['quizAttempts'] as $attempt)
        <div class="box">
            <h3>{{ $attempt['quiz_title'] ?? '-' }}</h3>
            <div class="small">
                {{ $attempt['subject_name'] ?? '-' }} / {{ $attempt['lesson_title'] ?? '-' }}
            </div>
            <div>
                点数：{{ $attempt['score'] }} / {{ $attempt['max_score'] }} 点
                （正答率：{{ $attempt['percentage'] }}%）
            </div>

            @if ($attempt['submitted_at'])
                <div class="small">提出日時：{{ $attempt['submitted_at'] }}</div>
            @endif
        </div>
    @empty
        <p class="small">この月の確認テスト受験記録はありません。</p>
    @endforelse

    <h2>学習記録</h2>

    @forelse ($report['learningLogs'] as $log)
        <div class="box">
            <h3>{{ $log['log_date'] }} / 気分：{{ $log['mood_label'] }}</h3>

            @if ($log['did_text'])
                <p class="pre"><strong>今日やったこと：</strong><br>{{ $log['did_text'] }}</p>
            @endif

            @if ($log['understood_text'])
                <p class="pre"><strong>分かったこと：</strong><br>{{ $log['understood_text'] }}</p>
            @endif

            @if ($log['difficult_text'])
                <p class="pre"><strong>難しかったこと：</strong><br>{{ $log['difficult_text'] }}</p>
            @endif

            @if ($log['question_text'])
                <p class="pre"><strong>聞きたいこと：</strong><br>{{ $log['question_text'] }}</p>
            @endif

            @if (count($log['comments']) > 0)
                <h3>先生コメント</h3>

                @foreach ($log['comments'] as $comment)
                    <div class="box">
                        <div class="small">
                            {{ $comment['teacher_name'] ?? '先生' }}
                            @if ($comment['created_at'])
                                / {{ $comment['created_at'] }}
                            @endif
                        </div>
                        <p class="pre">{{ $comment['comment'] }}</p>
                    </div>
                @endforeach
            @endif
        </div>
    @empty
        <p class="small">この月の学習記録はありません。</p>
    @endforelse
</body>
</html>