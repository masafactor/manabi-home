<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
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
        MonthlyReportService $monthlyReportService
    ): Response {
        $student = $request->user();

        abort_unless($student->role === 'student', 403);

        return Inertia::render(
            'student/monthly-reports/show',
            $monthlyReportService->build(
                $student,
                $request->query('month')
            )
        );
    }

    public function pdf(
        Request $request,
        MonthlyReportService $monthlyReportService
    ): HttpResponse {
        $student = $request->user();

        abort_unless($student->role === 'student', 403);

        $report = $monthlyReportService->build(
            $student,
            $request->query('month')
        );

        $pdf = Pdf::loadView('pdf.monthly-report', [
            'report' => $report,
        ])->setPaper('a4');

        $filename = sprintf(
            'student-monthly-report-%s-%s.pdf',
            $student->id,
            $report['month']
        );

        return $pdf->download($filename);
    }
}