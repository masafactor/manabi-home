<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MonthlyReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response as HttpResponse;

class MonthlyReportController extends Controller
{
    public function show(
        Request $request,
        User $student,
        MonthlyReportService $monthlyReportService
    ): Response {
        $teacher = $request->user();

        $isLinked = $teacher->teacherStudents()
            ->where('users.id', $student->id)
            ->exists();

        abort_unless($isLinked, 403);
        abort_unless($student->role === 'student', 404);

        return Inertia::render(
            'teacher/monthly-reports/show',
            $monthlyReportService->build(
                $student,
                $request->query('month')
            )
        );
    }

    public function pdf(
        Request $request,
        User $student,
        MonthlyReportService $monthlyReportService
    ): HttpResponse {
        $teacher = $request->user();

        $isLinked = $teacher->teacherStudents()
            ->where('users.id', $student->id)
            ->exists();

        abort_unless($isLinked, 403);
        abort_unless($student->role === 'student', 404);

        $report = $monthlyReportService->build(
            $student,
            $request->query('month')
        );

        $pdf = Pdf::loadView('pdf.monthly-report', [
            'report' => $report,
        ])->setPaper('a4');

        $filename = sprintf(
            'monthly-report-%s-%s.pdf',
            $student->id,
            $report['month']
        );

        return $pdf->download($filename);
    }
}