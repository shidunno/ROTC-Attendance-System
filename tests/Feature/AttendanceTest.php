<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_cadet_can_be_marked_present_via_qr_scan()
    {
        DB::table('attendance_rules')->insert([
            'time_in_start' => '6:00 AM',
            'time_in_end' => '7:30 AM',
            'time_out_start' => '12:00 PM',
            'time_out_end' => '1:00 PM',
            'late_after' => '7:15 AM',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Carbon::setTestNow('2026-09-14 06:30:00');

        $user = User::query()->create([
            'name' => 'Test Cadet',
            'email' => 'cadet@test.com',
            'password' => bcrypt('password'),
        ]);
        
        $qrData = json_encode([
            'id' => $user->id,
            'salt' => now()->timestamp * 1000
        ]);

        $response = $this->actingAs($user)->post('/admin/attendance/scan', [
            'qr_data' => $qrData
        ]);

        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('attendances', [
            'user_id' => $user->id,
            'date' => Carbon::today()->toDateString(),
            'status' => 'present',
        ]);

        Carbon::setTestNow();
    }

    public function test_cadet_is_marked_late_if_scanned_after_late_threshold()
    {
        DB::table('attendance_rules')->insert([
            'time_in_start' => '6:00 AM',
            'time_in_end' => '7:30 AM',
            'time_out_start' => '12:00 PM',
            'time_out_end' => '1:00 PM',
            'late_after' => '7:15 AM',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Carbon::setTestNow('2026-09-14 07:20:00');

        $user = User::query()->create([
            'name' => 'Late Cadet',
            'email' => 'late@test.com',
            'password' => bcrypt('password'),
        ]);
        
        $qrData = json_encode([
            'id' => $user->id,
            'salt' => now()->timestamp * 1000
        ]);

        $response = $this->actingAs($user)->post('/admin/attendance/scan', [
            'qr_data' => $qrData
        ]);

        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('attendances', [
            'user_id' => $user->id,
            'status' => 'late',
        ]);

        Carbon::setTestNow();
    }

    public function test_cadet_is_marked_absent_if_scanned_after_time_in_end()
    {
        DB::table('attendance_rules')->insert([
            'time_in_start' => '6:00 AM',
            'time_in_end' => '7:30 AM',
            'time_out_start' => '12:00 PM',
            'time_out_end' => '1:00 PM',
            'late_after' => '7:15 AM',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Carbon::setTestNow('2026-09-14 07:40:00');

        $user = User::query()->create([
            'name' => 'Absent Cadet',
            'email' => 'absent@test.com',
            'password' => bcrypt('password'),
        ]);
        
        $qrData = json_encode([
            'id' => $user->id,
            'salt' => now()->timestamp * 1000
        ]);

        $response = $this->actingAs($user)->post('/admin/attendance/scan', [
            'qr_data' => $qrData
        ]);

        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('attendances', [
            'user_id' => $user->id,
            'status' => 'absent',
        ]);

        Carbon::setTestNow();
    }

    public function test_cadet_cannot_be_scanned_twice_on_the_same_day_due_to_cooldown()
    {
        $user = User::query()->create([
            'name' => 'Test Cadet Two',
            'email' => 'cadet2@test.com',
            'password' => bcrypt('password'),
        ]);
        
        $today = Carbon::today()->toDateString();

        Attendance::create([
            'user_id' => $user->id,
            'date' => $today,
            'status' => 'present',
            'time_in' => now(),
        ]);

        $qrData = json_encode([
            'id' => $user->id,
            'salt' => now()->timestamp * 1000
        ]);

        $response = $this->actingAs($user)->post('/admin/attendance/scan', [
            'qr_data' => $qrData
        ]);

        $response->assertSessionHasErrors('qr_data');
    }

    public function test_leader_sees_recent_scans_on_attendance_dashboard()
    {
        $leader = User::query()->create([
            'name' => 'Test Leader',
            'email' => 'leader@test.com',
            'role' => 'leader',
            'password' => bcrypt('password'),
        ]);

        $cadet = User::query()->create([
            'name' => 'Scanned Cadet',
            'email' => 'scanned@test.com',
            'password' => bcrypt('password'),
        ]);

        Attendance::create([
            'user_id' => $cadet->id,
            'date' => now()->toDateString(),
            'status' => 'present',
            'time_in' => now(),
        ]);

        $response = $this->actingAs($leader)->get('/my-attendance');

        $response->assertStatus(200);
        
        $page = $response->viewData('page');
        $this->assertEquals('Components/Usermanagementnumber', $page['component']);
        $this->assertCount(1, $page['props']['recentScans']);
        $this->assertEquals('Scanned Cadet', $page['props']['recentScans'][0]['user']['name']);
    }
}