<?php

namespace App\Imports;

use App\Mail\CadetCredentialsMail;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CadetsImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows): void
    {
        ini_set('max_execution_time', 120);

        $currentYear = date('Y');

        // Get the latest sequence number for this year once
        $latestUser = User::where('custom_id', 'like', "CAD-{$currentYear}-%")
            ->orderBy('id', 'desc')
            ->first();

        $nextSequence = 1;
        if ($latestUser && preg_match('/CAD-\d{4}-(\d+)/', $latestUser->custom_id, $matches)) {
            $nextSequence = intval($matches[1]) + 1;
        }

        $usersData = [];
        $pendingEmails = []; // holds plain-text creds just long enough to queue the mail
        $existingEmails = User::pluck('email')->toArray();

        foreach ($rows as $row) {
            // Skip empty rows or rows missing required fields
            if (empty($row['name']) || empty($row['email'])) {
                continue;
            }

            $email = trim($row['email']);

            // Skip duplicates within the file or database
            if (in_array($email, $existingEmails)) {
                continue;
            }
            $existingEmails[] = $email;

            $customId = sprintf("CAD-%s-%04d", $currentYear, $nextSequence++);
            $name = trim($row['name']);
            $temporaryPassword = Str::random(10);

            $usersData[] = [
                'custom_id'   => $customId,
                'name'        => $name,
                'email'       => $email,
                'password'    => Hash::make($temporaryPassword),
                'role'        => 'cadet',
                'status'      => 'Active',
                'created_at'  => now(),
                'updated_at'  => now(),
            ];

            // Keep the plain password only in memory, only to queue the email below
            $pendingEmails[] = [
                'name'      => $name,
                'custom_id' => $customId,
                'email'     => $email,
                'password'  => $temporaryPassword,
            ];
        }

        // Insert all rows in one batch
        if (!empty($usersData)) {
            User::insert($usersData);
        }

        // Queue one credentials email per cadet
        foreach ($pendingEmails as $cred) {
            Mail::to($cred['email'])->queue(new CadetCredentialsMail(
                $cred['name'],
                $cred['custom_id'],
                $cred['email'],
                $cred['password'],
            ));
        }
    }
}