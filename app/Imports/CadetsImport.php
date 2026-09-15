<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class CadetsImport implements ToModel, WithHeadingRow, WithValidation
{
    private int $nextSequence;
    private string $currentYear;

    public function __construct()
    {
        // 1. Get the current year dynamically (e.g., "2026")
        $this->currentYear = date('Y');

        // 2. Query the database for the last user whose custom_id starts with "CAD-2026-"
        $latestUser = User::where('custom_id', 'like', "CAD-{$this->currentYear}-%")
                          ->orderBy('id', 'desc')
                          ->first();

        // 3. Extract the last sequence number and increment it, or start at 1
        if ($latestUser && preg_match('/CAD-\d{4}-(\d+)/', $latestUser->custom_id, $matches)) {
            $this->nextSequence = intval($matches[1]) + 1;
        } else {
            $this->nextSequence = 1;
        }
    }

    /**
     * Map each row from the Excel file to a User model.
     *
     * @param array $row
     * @return Model|null
     */
    public function model(array $row): Model|null
    {
        // Skip empty rows or rows missing required fields
        if (empty($row['name']) || empty($row['email'])) {
            return null;
        }

        // 4. Format custom_id (e.g., CAD-2026-0001) and increment for the next row
        $customId = sprintf("CAD-%s-%04d", $this->currentYear, $this->nextSequence++);

        // Generate a random temporary password (10 characters)
        $temporaryPassword = Str::random(10);

        return new User([
            'custom_id'   => $customId,
            'name'      => trim($row['name']),
            'email'       => trim($row['email']),
            'password'    => Hash::make($temporaryPassword),
            'role'        => 'cadet',
        ]);    
    }

    public function rules(): array
    {
        return [
            // Ensure email is valid and doesn't already exist in the 'users' table
            'email' => ['required', 'email', 'unique:users,email'],
            
            'name' => ['required', 'string'],
        ];
    }
}