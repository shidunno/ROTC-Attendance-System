<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_excel_report_downloads_matrix_successfully()
    {
        // 1. Create a test user (cadet)
        $user = User::factory()->create([
            'name' => 'Cadet Tester',
            'role' => 'cadet'
        ]);

        // 2. Seed an attendance record for September 15, 2026
        Attendance::create([
            'user_id' => $user->id,
            'date' => '2026-09-15',
            'status' => 'present',
            'time_in' => '07:30:00',
            'time_out' => '17:00:00',
            'remarks' => 'Test entry'
        ]);

        // 3. Request the report endpoint with month=09 and year=2026
        $response = $this->get('/reports/export-excel?month=09&year=2026');

        // 4. Assert the response is successful and streams a CSV file
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        
        // 5. Assert the CSV content contains the cadet's name and the 'P' code for day 15
        $content = $response->streamedContent();
        
        $this->assertStringContainsString('Cadet Tester', $content);
        $this->assertStringContainsString('P', $content); // Present code for day 15
    }
}