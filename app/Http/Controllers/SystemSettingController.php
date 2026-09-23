<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function index()
    {
        abort_unless(
            auth()->check() && auth()->user()->role === 'admin',
            403
        );

        $settings = SystemSetting::first();

        if (!$settings) {
            $settings = SystemSetting::create([
                'system_name' => 'ROTC Attendance System',
                'institution_name' => 'Reserve Officers’ Training Corps - Central Luzon State University',
                'academic_year' => '2026 - 2027',
                'contact_email' => 'rotc@gmail.com',
            ]);
        }

        return Inertia::render('Setting', [
            'systemSettings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        abort_unless(
            auth()->check() && auth()->user()->role === 'admin',
            403
        );

        $validated = $request->validate([
            'system_name' => 'required|string|max:255',
            'institution_name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:50',
            'contact_email' => 'required|email|max:255',
        ]);

        $settings = SystemSetting::first();

        if (!$settings) {
            $settings = new SystemSetting();
        }

        $settings->system_name = $validated['system_name'];
        $settings->institution_name = $validated['institution_name'];
        $settings->academic_year = $validated['academic_year'];
        $settings->contact_email = $validated['contact_email'];

        $settings->save();

        return redirect()
            ->route('settings.index')
            ->with('success', 'System information saved successfully.');
    }
}