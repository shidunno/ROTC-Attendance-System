<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CadetsImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows): void
    {
        $currentYear = date('Y');

        // 1. Get the latest sequence number once from the database
        $latestUser = User::where('custom_id', 'like', "CAD-{$currentYear}-%")
            ->orderBy('id', 'desc')
            ->first();

        $nextSequence = 1;
        if ($latestUser && preg_match('/CAD-\d{4}-(\d+)/', $latestUser->custom_id, $matches)) {
            $nextSequence = intval($matches[1]) + 1;
        }

        $usersData = [];
        $existingEmails = User::pluck('email')->toArray(); // Fetch existing emails once for quick checking

        foreach ($rows as $row) {
            // Skip empty rows or rows missing required fields
            if (empty($row['name']) || empty($row['email'])) {
                continue;
            }

            $email = trim($row['email']);

            // Skip duplicates within the file or database to prevent crashes
            if (in_array($email, $existingEmails)) {
                continue;
            }
            $existingEmails[] = $email; // Track to prevent duplicates inside the same file

            // Format custom_id
            $customId = sprintf("CAD-%s-%04d", $currentYear, $nextSequence++);
            
            // Generate a random temporary password
            $temporaryPassword = Str::random(10);

            $usersData[] = [
                'custom_id'   => $customId,
                'name'        => trim($row['name']),
                'email'       => $email,
                'password'    => Hash::make($temporaryPassword),
                'role'        => 'cadet',
                'status'      => 'Active',
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }

        // 2. Insert all rows in one single database query batch
        if (!empty($usersData)) {
            User::insert($usersData);
        }
    }
}