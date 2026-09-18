<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AnnouncementController;
use App\Models\Announcement;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ExcuseLetterController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

Route::get('/', function () { 
    return Inertia::render('Login');
})->name('login');

Route::post('/Login', function(Request $request){

    $request->validate ([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    $credentials = [
        'email' => $request->email,
        'password' => $request->password
    ];

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect('/Dashboard');
    }

    return back()->withErrors([
        'email' => 'Wrong credentials'
    ]);
    
});

Route::get('/Forgotpassword', function (Request $request) {
    return Inertia::render('Forgotpassword');
});

Route::post('/Forgotpassword', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $user = DB::table('users')->where('email', $request->email)->first();

    if (!$user) {
        return back()->withErrors(['email' => 'No account found with that email.']);
    }

    $code = random_int(100000, 999999);

    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $request->email],
        ['token' => $code, 'created_at' => now()]
    );

    Mail::raw("Your ROTC Attendance System password reset code is: $code", function ($message) use ($request) {
        $message->to($request->email)->subject('Your Password Reset Code');
    });

    return back()->with('status', 'Reset code sent to your email.');
});

// Verify Password Reset Code
Route::post('/VerifyCode', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'code' => 'required|digits:6',
    ]);

    $resetToken = DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->where('token', $request->code)
        ->first();

    if (!$resetToken) {
        return back()->withErrors([
            'code' => 'Invalid verification code.'
        ]);
    }

    return Inertia::render('Resetpassword', [
        'email' => $request->email,
        'code' => $request->code,
    ]);

});


Route::middleware('auth')->group(function() {   
Route::get('/Dashboard', function() {

    $today = \Carbon\Carbon::today()->toDateString();

    $attendanceData = [
        'present' => \App\Models\Attendance::whereDate('date', $today)
            ->whereRaw('LOWER(status) = ?', ['present'])
            ->count(),

        'absent' => \App\Models\Attendance::whereDate('date', $today)
            ->whereRaw('LOWER(status) = ?', ['absent'])
            ->count(),

        'late' => \App\Models\Attendance::whereDate('date', $today)
            ->whereRaw('LOWER(status) = ?', ['late'])
            ->count(),

        'excused' => \App\Models\Attendance::whereDate('date', $today)
            ->whereRaw('LOWER(status) = ?', ['excused'])
            ->count(),
    ];

    $platoonDataRaw = \App\Models\Attendance::with('user')
        ->whereDate('date', $today)
        ->get()
        ->groupBy(function ($item) {
            return $item->user->platoon?->number ?? 'Unknown Platoon';
        });

    $platoonData = [];

    foreach ($platoonDataRaw as $platoonName => $records) {
        $platoonData[] = [
            'platoon' => $platoonName,

            'Present' => $records
                ->filter(fn($item) => strtolower($item->status) === 'present')
                ->count(),

            'Late' => $records
                ->filter(fn($item) => strtolower($item->status) === 'late')
                ->count(),

            'Absent' => $records
                ->filter(fn($item) => strtolower($item->status) === 'absent')
                ->count(),

            'Excused' => $records
                ->filter(fn($item) => strtolower($item->status) === 'excused')
                ->count(),
        ];
    }

    return Inertia::render('Dashboard', [
        'user' => Auth::user(),
        'attendanceData' => $attendanceData,
        'platoonData' => $platoonData,
    ]);

});

    // Announcement Routes
    Route::get('/Announcement', [AnnouncementController::class, 'index'])->name('announcement.index');
    Route::post('/Announcement', [AnnouncementController::class, 'store'])->name('announcement.store');
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);
    Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
    Route::put('/announcements/{announcement}/pin', [AnnouncementController::class, 'togglePin']);

    Route::get('/Student', [UserController::class, 'index']);
    Route::get('/student', [UserController::class, 'index'])->name('cadets.index');

    Route::get('/Platoon', function() {
        return Inertia::render('Platoon');
    });

    // Excuse Letter Routes
    Route::get('/Excuseletter', [ExcuseLetterController::class, 'index'])->name('excuse-letters.index');
    Route::post('/excuse-letters', [ExcuseLetterController::class, 'store'])->name('excuse-letters.store');
    Route::post('/excuse-letters/{excuseLetter}', [ExcuseLetterController::class, 'update'])->name('excuse-letters.update');

    Route::get('/reports/export-excel', [ReportController::class, 'exportMonthlyExcel']);
    
    Route::get('/Reports', function() {
        return Inertia::render('Reports');
    });

    Route::post('/change-password', [UserController::class, 'changePassword'])->name('password.change');

    Route::get('/Usermanagement', [UserController::class, 'index']);
    Route::put('/Usermanagement/{id}', [UserController::class, 'update']);
    Route::delete('/Usermanagement/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/Usermanagement/batch-delete', [UserController::class, 'batchDelete'])->name('users.batchDelete');
    Route::post('/Usermanagement/batch-archive', [UserController::class, 'batchArchive'])->name('users.batchArchive');
    Route::patch('/users/assign-platoon', [UserController::class, 'assignPlatoon'])->name('users.assign-platoon');

    Route::get('/Setting', function () {
        return Inertia::render('Setting');
    });
    
    Route::post('/profile/update', [UserController::class, 'updateProfile'])->name('profile.update');

    Route::post('/import-cadets', [UserController::class, 'import']);

    Route::post('/admin/attendance/scan', [AttendanceController::class, 'scan'])->name('attendance.scan');

    Route::get('/my-attendance', [AttendanceController::class, 'myAttendance'])->name('attendance.my');

    Route::post('/Logout', function(Request $request) {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    });
});

// Reset Password
Route::post('/Resetpassword', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'code' => 'required|digits:6',
        'password' => 'required|min:8|confirmed',
    ]);

    $resetToken = DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->where('token', $request->code)
        ->first();

    if (!$resetToken) {
        return back()->withErrors([
            'code' => 'Invalid verification code.'
        ]);
    }

    if (now()->diffInMinutes($resetToken->created_at) > 15) {
        return back()->withErrors([
            'code' => 'Verification code has expired.'
        ]);
    }

    DB::table('users')
        ->where('email', $request->email)
        ->update([
            'password' => Hash::make($request->password),
        ]);

    DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->delete();

    return redirect('/')->with('status', 'Password changed successfully.');

});