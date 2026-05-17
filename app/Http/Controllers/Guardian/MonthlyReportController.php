<?php

namespace App\Http\Controllers\Guardian;

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
        $guardian = $request->user();

        $isLinked = $guardian->guardianStudents()
            ->where('users.id', $student->id)
            ->exists();

        abort_unless($isLinked, 403);
        abort_unless($student->role === 'student', 404);

        return Inertia::render(
            'guardian/monthly-reports/show',
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
        $guardian = $request->user();

        $isLinked = $guardian->guardianStudents()
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
            'guardian-monthly-report-%s-%s.pdf',
            $student->id,
            $report['month']
        );

        return $pdf->download($filename);
    }
}