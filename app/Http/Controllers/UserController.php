<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Imports\CadetsImport;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        $query = User::select(
            'id',
            'custom_id',
            'name',
            'role',
            'email',
            'status',
            'profile_photo_path',
            'platoon_id'
        )
            ->with('platoon')
            ->whereIn('role', ['cadet', 'leader']);

        if ($currentUser && $currentUser->role === 'leader') {
            $query->where('platoon_id', $currentUser->platoon_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $digits = preg_replace('/[^0-9]/', '', $search);

            $query->where(function ($q) use ($search, $digits) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('custom_id', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhereHas('platoon', function ($platoonQuery) use ($search, $digits) {
                        $platoonQuery->where('name', 'like', "%{$search}%");

                        if (!empty($digits)) {
                            $platoonQuery->orWhere('number', $digits);
                        }
                    });
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $component = $request->is('Student*')
            ? 'Cadets'
            : 'Usermanagement';

        $countQuery = User::whereIn('role', ['cadet', 'leader']);

        if ($currentUser && $currentUser->role === 'leader') {
            $countQuery->where(
                'platoon_id',
                $currentUser->platoon_id
            );
        }

        return Inertia::render($component, [
            'users' => $query->latest()->get(),
            'platoons' => \App\Models\Platoon::all(),
            'page' => $request->input('page', 'Cadets'),
            'filters' => $request->only([
                'search',
                'role',
                'status'
            ]),
            'userCounts' => [
                'total' => (clone $countQuery)->count(),
                'active' => (clone $countQuery)
                    ->where('status', 'Active')
                    ->count(),
                'archive' => (clone $countQuery)
                    ->where('status', 'Archive')
                    ->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Store a newly created platoon.
     */
    public function storePlatoon(Request $request)
    {
        $request->validate([
            'number' => 'required|integer|unique:platoons,number',
            'name' => 'nullable|string|max:255',
        ]);

        \App\Models\Platoon::create([
            'number' => $request->number,
            'name' => $request->name,
        ]);

        return back()->with(
            'success',
            'Platoon created successfully.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::where('id', $id)
            ->orWhere('custom_id', $id)
            ->firstOrFail();

        $request->validate([
            'name' => 'required|string',
            'role' => 'required|in:cadet,leader',
            'email' => 'required|email',
            'status' => 'required|string',
        ]);

        $oldRole = $user->role;
        $newRole = $request->role;

        $customId = $user->custom_id;
        $platoonId = $user->platoon_id;
        $year = date('Y');

        if ($oldRole === 'cadet' && $newRole === 'leader') {

            $lastLeader = User::where('role', 'leader')
                ->where('custom_id', 'like', "LDR-$year-%")
                ->orderBy('custom_id', 'desc')
                ->first();

            if ($lastLeader) {
                $lastNumber = (int) substr(
                    $lastLeader->custom_id,
                    -4
                );

                $newNumber = $lastNumber + 1;
            } else {
                $newNumber = 1;
            }

            $customId = 'LDR-' .
                $year .
                '-' .
                str_pad(
                    $newNumber,
                    4,
                    '0',
                    STR_PAD_LEFT
                );

            $existingPlatoon = DB::table('platoons')
                ->where('leader_id', $user->id)
                ->first();

            if ($existingPlatoon) {
                $platoonId = $existingPlatoon->id;
            } else {
                $maxNumber = DB::table('platoons')->max('number') ?? 0;

                $nextPlatoonNumber = $maxNumber + 1;

                $platoonId = DB::table('platoons')->insertGetId([
                    'number' => $nextPlatoonNumber,
                    'leader_id' => $user->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        else if ($oldRole === 'leader' && $newRole === 'cadet') {

            $lastCadet = User::where('role', 'cadet')
                ->where('custom_id', 'like', "CAD-$year-%")
                ->orderBy('custom_id', 'desc')
                ->first();

            if ($lastCadet) {
                $lastNumber = (int) substr(
                    $lastCadet->custom_id,
                    -4
                );

                $newNumber = $lastNumber + 1;
            } else {
                $newNumber = 1;
            }

            $customId = 'CAD-' .
                $year .
                '-' .
                str_pad(
                    $newNumber,
                    4,
                    '0',
                    STR_PAD_LEFT
                );

            DB::table('platoons')
                ->where('leader_id', $user->id)
                ->delete();

            $platoonId = null;
        }

        $user->update([
            'custom_id' => $customId,
            'name' => $request->name,
            'role' => $newRole,
            'email' => $request->email,
            'status' => $request->status,
            'platoon_id' => $platoonId,
        ]);

        return back()->with(
            'success',
            'User updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::where('id', $id)
            ->orWhere('custom_id', $id)
            ->firstOrFail();

        $user->delete();

        return back()->with(
            'success',
            'User deleted successfully.'
        );
    }

    /**
     * Delete multiple selected users.
     */
    public function batchDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
        ]);

        User::whereIn('id', $request->ids)
            ->orWhereIn('custom_id', $request->ids)
            ->delete();

        return back()->with(
            'success',
            'Selected users deleted successfully.'
        );
    }

    /**
     * Archive multiple selected users.
     */
    public function batchArchive(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
        ]);

        User::whereIn('id', $request->ids)
            ->orWhereIn('custom_id', $request->ids)
            ->update([
                'status' => 'Archive'
            ]);

        return back()->with(
            'success',
            'Selected users archived successfully.'
        );
    }

    /**
     * Import cadets.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        try {

            Excel::import(
                new CadetsImport,
                $request->file('file')
            );

            return back()->with(
                'success',
                'Cadets imported successfully!'
            );

        } catch (ValidationException $e) {

            $errors = [];

            foreach ($e->failures() as $failure) {
                $errors[] =
                    "Row {$failure->row()}: " .
                    implode(', ', $failure->errors());
            }

            return back()->withErrors([
                'import' => $errors
            ]);
        }
    }

    /**
     * Update authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return back()->withErrors([
                'profile' => 'User is not authenticated.',
            ]);
        }

        $isAdmin = strtolower(
            (string) $user->role
        ) === 'admin';

        $validated = $request->validate([
            'name' => $isAdmin
                ? [
                    'required',
                    'string',
                    'max:255'
                ]
                : ['nullable'],

            'email' => $isAdmin
                ? [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users')
                        ->ignore($user->id),
                ]
                : ['nullable'],

            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Update name and email
        |--------------------------------------------------------------------------
        */

        if ($isAdmin) {
            $user->name = $validated['name'];
            $user->email = $validated['email'];
        }

        /*
        |--------------------------------------------------------------------------
        | Update profile photo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('avatar')) {

            $file = $request->file('avatar');

            $filename =
                'avatar_' .
                $user->id .
                '_' .
                time() .
                '.' .
                $file->getClientOriginalExtension();

            $path = $file->storeAs(
                'avatars',
                $filename,
                'public'
            );

            $user->profile_photo_path = $path;
        }

        $user->save();

        $user->refresh();

        return back()->with(
            'success',
            'Profile updated successfully.'
        );
    }

    /**
     * Assign users to a platoon.
     */
    public function assignPlatoon(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'platoon_id' => 'required|exists:platoons,id',
        ]);

        User::whereIn('id', $request->user_ids)
            ->orWhereIn('custom_id', $request->user_ids)
            ->update([
                'platoon_id' => $request->platoon_id,
            ]);

        return back()->with(
            'success',
            'Platoons assigned successfully.'
        );
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required'],
            'new_password' => [
                'required',
                'string',
                'min:6',
                'confirmed'
            ],
        ]);

        if (!Hash::check(
            $validated['current_password'],
            $user->password
        )) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make(
                $validated['new_password']
            ),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password successfully updated!',
        ]);
    }
}