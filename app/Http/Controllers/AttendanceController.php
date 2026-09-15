<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();

        // 1. Transform attendance counts into an associative array for Dashboard props
        $rawAttendance = Attendance::where('date', $today)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $attendanceData = [
            'present' => $rawAttendance->get('present', 0) + $rawAttendance->get('Present', 0),
            'late'    => $rawAttendance->get('late', 0) + $rawAttendance->get('Late', 0),
            'absent'  => $rawAttendance->get('absent', 0) + $rawAttendance->get('Absent', 0),
            'excused' => $rawAttendance->get('excused', 0) + $rawAttendance->get('Excused', 0),
        ];

        // 2. Query attendance grouped by user platoon for the bar graph
        $platoonDataRaw = Attendance::with('user.platoon')
            ->where('date', $today)
            ->get()
            ->groupBy(function($item) {
                if ($item->user && $item->user->platoon) {
                    return 'Platoon ' . $item->user->platoon->number;
                }
                return 'Unknown Platoon';
            });

        // 3. Format into the structure Recharts expects
        $platoonData = [];
        foreach ($platoonDataRaw as $platoonName => $records) {
            $platoonData[] = [
                'platoon' => $platoonName,
                'Present' => $records->filter(fn($i) => strtolower($i->status) === 'present')->count(),
                'Late'    => $records->filter(fn($i) => strtolower($i->status) === 'late')->count(),
                'Absent'  => $records->filter(fn($i) => strtolower($i->status) === 'absent')->count(),
                'Excused' => $records->filter(fn($i) => strtolower($i->status) === 'excused')->count(),
            ];
        }

        return Inertia::render('Dashboard', [
            'user' => auth()->user(),
            'role' => auth()->user()->role ?? 'admin',
            'attendanceData' => $attendanceData,
            'platoonData' => $platoonData,
        ]);
    }

    public function scan(Request $request)
    {
        $request->validate([
            'qr_data' => 'required|string',
        ]);

        $data = json_decode($request->qr_data, true);

        if (!$data || !isset($data['id'])) {
            return back()->withErrors([
                'qr_data' => 'Invalid QR Code format.',
            ]);
        }

        $user = User::find($data['id']);

        if (!$user) {
            return back()->withErrors([
                'qr_data' => 'Cadet not found.',
            ]);
        }

        // Check if the QR code salt is older than 75 seconds
        if (isset($data['salt'])) {
            $ageInSeconds = (
                now()->timestamp * 1000 - $data['salt']
            ) / 1000;

            if ($ageInSeconds > 75) {
                return back()->withErrors([
                    'qr_data' => 'QR Code has expired! Please ask the cadet to refresh.',
                ]);
            }
        }

        $today = Carbon::today()->toDateString();

        // Check if attendance has already been recorded for today
        $existingAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($existingAttendance) {
            return back()->withErrors([
                'qr_data' => "{$user->name} has already been scanned today! (Cooldown active)",
            ]);
        }

        // Fetch active attendance rules from the database
        $rules = DB::table('attendance_rules')
            ->latest()
            ->first();

        $now = Carbon::now();

        // Parse database rule times or fall back to defaults
        $timeInStart = $rules
            ? Carbon::parse($rules->time_in_start)
            : Carbon::parse('06:00:00');

        $lateAfter = $rules
            ? Carbon::parse($rules->late_after)
            : Carbon::parse('07:15:00');

        $timeInEnd = $rules
            ? Carbon::parse($rules->time_in_end)
            : Carbon::parse('07:30:00');

        // Determine status based on time rules
        $status = 'present';

        if (
            $now->greaterThan($lateAfter) &&
            $now->lessThanOrEqualTo($timeInEnd)
        ) {
            $status = 'late';
        } elseif ($now->greaterThan($timeInEnd)) {
            $status = 'absent';
        }

        // Record attendance for today
        Attendance::create([
            'user_id' => $user->id,
            'date' => $today,
            'status' => $status,
            'time_in' => $now,
        ]);

        $ucStatus = ucfirst($status);

        return back()->with(
            'success',
            "Successfully marked {$user->name} as {$ucStatus}!"
        );
    }

    public function myAttendance()
    {
        $user = auth()->user();

        $attendanceHistory = Attendance::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        $stats = [
            'present' => $attendanceHistory
                ->where('status', 'present')
                ->count(),

            'late' => $attendanceHistory
                ->where('status', 'late')
                ->count(),

            'absent' => $attendanceHistory
                ->where('status', 'absent')
                ->count(),

            'excused' => $attendanceHistory
                ->where('status', 'excused')
                ->count(),
        ];

        // Fetch the 5 most recent attendance scans with user info attached
        $recentScans = Attendance::with('user')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Components/Attendancedashboard', [
            'attendanceHistory' => $attendanceHistory,
            'stats' => $stats,
            'recentScans' => $recentScans,
        ]);
    }
}