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
    protected array $errors = [];

    protected int $importedCount = 0;

    public function collection(Collection $rows): void
    {
        ini_set('max_execution_time', 120);

        $currentYear = date('Y');

        // Get the latest sequence number for this year once.
        $latestUser = User::where(
            'custom_id',
            'like',
            "CAD-{$currentYear}-%"
        )
            ->orderBy('id', 'desc')
            ->first();

        $nextSequence = 1;

        if (
            $latestUser &&
            preg_match(
                '/CAD-\d{4}-(\d+)/',
                $latestUser->custom_id,
                $matches
            )
        ) {
            $nextSequence = intval($matches[1]) + 1;
        }

        $usersData = [];

        // Holds plain-text credentials only long enough to queue the mail.
        $pendingEmails = [];

        // Normalize existing database emails for duplicate checking.
        $existingEmails = User::pluck('email')
            ->map(function ($email) {
                return strtolower(trim($email));
            })
            ->toArray();

        foreach ($rows as $index => $row) {

            /*
             * WithHeadingRow:
             * Excel row 1 = headings.
             * Collection index starts at 0.
             *
             * Therefore:
             * index 0 = Excel row 2
             * index 1 = Excel row 3
             * etc.
             */
            $excelRow = $index + 2;

            $name = trim((string) ($row['name'] ?? ''));
            $email = trim((string) ($row['email'] ?? ''));

            /*
             * Ignore completely blank rows.
             */
            if ($name === '' && $email === '') {
                continue;
            }

            /*
             * Name is required.
             */
            if ($name === '') {
                $this->errors[] =
                    "Row {$excelRow} — Name is required.";

                continue;
            }

            /*
             * Email is required.
             */
            if ($email === '') {
                $this->errors[] =
                    "Row {$excelRow} — Email address is required.";

                continue;
            }

            /*
             * IMPORTANT:
             *
             * Validate the email BEFORE:
             *
             * 1. Creating the user.
             * 2. Adding it to pendingEmails.
             * 3. Calling Mail::to().
             *
             * This does NOT require .com or .ph.
             */
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->errors[] =
                    "Row {$excelRow} — Invalid email address.";

                continue;
            }

            /*
             * Normalize email for duplicate checking.
             */
            $normalizedEmail = strtolower($email);

            /*
             * Skip duplicate email addresses.
             */
            if (in_array($normalizedEmail, $existingEmails, true)) {
                $this->errors[] =
                    "Row {$excelRow} — Email address already exists.";

                continue;
            }

            $existingEmails[] = $normalizedEmail;

            $customId = sprintf(
                "CAD-%s-%04d",
                $currentYear,
                $nextSequence++
            );

            $temporaryPassword = Str::random(10);

            $usersData[] = [
                'custom_id'  => $customId,
                'name'       => $name,
                'email'      => $email,
                'password'   => Hash::make($temporaryPassword),
                'role'       => 'cadet',
                'status'     => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            /*
             * Only VALID emails reach this array.
             */
            $pendingEmails[] = [
                'name'      => $name,
                'custom_id' => $customId,
                'email'     => $email,
                'password'  => $temporaryPassword,
            ];
        }

        /*
         * Insert valid users only.
         */
        if (!empty($usersData)) {
            User::insert($usersData);

            $this->importedCount = count($usersData);
        }

        /*
         * Send/queue emails only for validated addresses.
         */
        foreach ($pendingEmails as $cred) {
            Mail::to($cred['email'])->queue(
                new CadetCredentialsMail(
                    $cred['name'],
                    $cred['custom_id'],
                    $cred['email'],
                    $cred['password'],
                )
            );
        }
    }

    /**
     * Get all import validation errors.
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Get number of successfully imported users.
     */
    public function getImportedCount(): int
    {
        return $this->importedCount;
    }
}