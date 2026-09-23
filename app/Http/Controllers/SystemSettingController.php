<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::firstOrCreate(
            ['id' => 1],
            [
                'system_name' => 'ROTC Attendance System',
                'institution_name' => '',
                'academic_year' => '',
                'contact_email' => '',
            ]
        );

        return Inertia::render('Setting', [
            'systemSettings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'system_name' => ['required', 'string', 'max:255'],
            'institution_name' => ['required', 'string', 'max:255'],
            'academic_year' => ['required', 'string', 'max:50'],
            'contact_email' => ['required', 'email', 'max:255'],
        ]);

        $settings = SystemSetting::updateOrCreate(
            ['id' => 1],
            [
                'system_name' => $validated['system_name'],
                'institution_name' => $validated['institution_name'],
                'academic_year' => $validated['academic_year'],
                'contact_email' => $validated['contact_email'],
            ]
        );

        return redirect()
            ->route('settings.index')
            ->with('success', 'System information saved successfully.');
    }
}