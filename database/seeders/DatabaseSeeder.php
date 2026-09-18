<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'custom_id' => 'ADM-001',
                'name' => 'System Admin',
                'password' => Hash::make('qazplm09'),
                'role' => 'admin',
            ]
        );

        // 2. Leader User
        User::updateOrCreate(
            ['email' => 'leader@gmail.com'],
            [
                'custom_id' => 'LDR-001',
                'name' => 'Squad Leader',
                'password' => Hash::make('qazplm09'),
                'role' => 'leader',
            ]
        );

        // 3. Cadet User
        User::updateOrCreate(
            ['email' => 'cadet@gmail.com'],
            [
                'custom_id' => 'CDT-001',
                'name' => 'ROTC Cadet',
                'password' => Hash::make('qazplm09'),
                'role' => 'cadet',
            ]
        );
    }
}