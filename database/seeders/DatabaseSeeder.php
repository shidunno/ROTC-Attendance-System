<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        User::create([
            'custom_id' => 'ADM-001',
            'name'      => 'System Admin',
            'email'     => 'admin@gmail.com',
            'password'  => Hash::make('qazplm09'),
            'role'      => 'admin',
        ]);

        // 2. Leader User
        User::create([
            'custom_id' => 'LDR-001',
            'name'      => 'Squad Leader',
            'email'     => 'leader@gmail.com',
            'password'  => Hash::make('qazplm09'),
            'role'      => 'leader',
        ]);

        // 3. Cadet User
        User::create([
            'custom_id' => 'CDT-001',
            'name'      => 'ROTC Cadet',
            'email'     => 'cadet@gmail.com',
            'password'  => Hash::make('qazplm09'),
            'role'      => 'cadet',
        ]);

        // 4. Temporary Attendance Rules
        DB::table('attendance_rules')->insert([
            'time_in_start' => '6:00 AM',
            'time_in_end' => '7:30 AM',
            'time_out_start' => '12:00 PM',
            'time_out_end' => '1:00 PM',
            'late_after' => '7:15 AM',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}