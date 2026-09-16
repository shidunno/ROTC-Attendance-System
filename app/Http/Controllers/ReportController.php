<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function exportMonthlyExcel(Request $request)
    {
        $month = $request->input('month'); // e.g., '09'
        $year = $request->input('year');   // e.g., '2026'

        if (!$month || !$year) {
            return back()->with('error', 'Month and year are required.');
        }

        // Get total days in the selected month (e.g., 30 for September)
        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;

        // Fetch all users ordered by name to include your seeded test accounts
        $users = User::orderBy('name', 'asc')->get();

        // Ensure month is formatted with a leading zero (e.g., '9' becomes '09')
        $formattedMonth = str_pad($month, 2, '0', STR_PAD_LEFT);

        // Fetch all attendance records for this month, indexed for quick lookup
        $attendances = Attendance::whereYear('date', $year)
            ->whereMonth('date', $formattedMonth)
            ->get()
            ->groupBy('user_id');

        $fileName = "teacher-attendance-matrix-{$month}-{$year}.csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($users, $attendances, $daysInMonth, $year, $formattedMonth) {
            $file = fopen('php://output', 'w');
            
            // 1. Build Dynamic Header Row: ['Cadet Name', 1, 2, 3, ..., 31, 'Total Present', 'Total Absent', 'Total Late']
            $headerRow = ['Cadet Name'];
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $headerRow[] = $day;
            }
            $headerRow[] = 'Total Present';
            $headerRow[] = 'Total Absent';
            $headerRow[] = 'Total Late';
            
            fputcsv($file, $headerRow);

            // 2. Loop through each cadet to build their row
            foreach ($users as $user) {
                $row = [$user->name];
                
                $userAttendances = $attendances->get($user->id, collect())->keyBy(function($item) {
                    return Carbon::parse($item->date)->day; // index by day number (1, 2, etc.)
                });

                $presentCount = 0;
                $absentCount = 0;
                $lateCount = 0;

                // Fill columns for each day of the month
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    if (isset($userAttendances[$day])) {
                        $status = $userAttendances[$day]->status; // present, absent, late, excused
                        
                        // Use standard shorthand letters like teachers do
                        $code = match($status) {
                            'present' => 'P',
                            'absent'  => 'A',
                            'late'    => 'L',
                            'excused' => 'E',
                            default   => '-'
                        };

                        if ($status === 'present') $presentCount++;
                        if ($status === 'absent') $absentCount++;
                        if ($status === 'late') $lateCount++;

                        $row[] = $code;
                    } else {
                        // If no record for that day, leave dash
                        $row[] = '-';
                    }
                }

                // Add summary totals at the end of the row
                $row[] = $presentCount;
                $row[] = $absentCount;
                $row[] = $lateCount;

                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}