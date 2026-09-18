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
            ['custom_id' => 'ADM-001'],
            [
                'name' => 'System Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('qazplm09'),
                'role' => 'admin',
            ]
        );

        // 2. Leader User
        User::updateOrCreate(
            ['custom_id' => 'LDR-001'],
            [
                'name' => 'Squad Leader',
                'email' => 'leader@gmail.com',
                'password' => Hash::make('qazplm09'),
                'role' => 'leader',
            ]
        );

        // 3. Cadet User
        User::updateOrCreate(
            ['custom_id' => 'CDT-001'],
            [
                'name' => 'ROTC Cadet',
                'email' => 'cadet@gmail.com',
                'password' => Hash::make('qazplm09'),
                'role' => 'cadet',
            ]
        );
    }
}