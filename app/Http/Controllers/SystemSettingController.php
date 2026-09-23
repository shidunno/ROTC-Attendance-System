<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    private const DEFAULTS = [
        'system_name' => 'ROTC Attendance System',
        'institution_name' => 'Reserve Officers’ Training Corps - Central Luzon State University',
        'academic_year' => '2026 - 2027',
        'contact_email' => 'rotc@gmail.com',
    ];

    public function index(): Response
    {
        abort_unless(auth()->user()?->role === 'admin', 403);

        return Inertia::render('Setting', [
            'systemSettings' => $this->settings(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->role === 'admin', 403);

        $validated = $request->validate([
            'system_name' => ['required', 'string', 'max:255'],
            'institution_name' => ['required', 'string', 'max:255'],
            'academic_year' => ['required', 'string', 'max:50'],
            'contact_email' => ['required', 'email', 'max:255'],
        ]);

        $settings = $this->settings();

        $settings->update($validated);

        return redirect()
            ->route('settings.index')
            ->with('success', 'System information saved successfully.');
    }

    private function settings(): SystemSetting
    {
        return SystemSetting::query()->firstOrCreate(
            ['id' => 1],
            self::DEFAULTS
        );
    }
}