<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\MonthlyReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
}