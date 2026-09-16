<?php

namespace App\Http\Controllers;

use App\Models\ExcuseLetter;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExcuseLetterController extends Controller
{
    // Display all excuse letters for the dashboard/index view
    public function index()
    {
        $user = auth()->user();

        // If Admin or Leader, show ONLY pending letters to manage
        if ($user->role === 'admin' || $user->role === 'leader') {
            $letters = ExcuseLetter::with('user')
                ->where('status', 'pending')
                ->latest()
                ->get();

            return Inertia::render('Excuseletter', [
                'letters' => $letters,
            ]);
        }

        // If regular Cadet, show only their personal history and submission form
        $letters = ExcuseLetter::where('user_id', $user->id)->latest()->get();

        return Inertia::render('Excuseletterdashboard', [
            'letters' => $letters,
        ]);
    }

    // Handle new excuse letter submissions from cadets
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'file' => 'required|file|mimes:pdf,jpg,png|max:2048',
        ]);

        // Store file in storage/app/public/excuse_letters
        $filePath = $request->file('file')->store('excuse_letters', 'public');

        // Create the excuse letter record
        ExcuseLetter::create([
            'user_id' => auth()->id(),
            'file_url' => asset('storage/' . $filePath),
            'date' => $request->date,
            'status' => 'pending',
        ]);

        // Redirect explicitly to the index route to refresh props/history on submission
        return redirect()->route('excuse-letters.index')->with('success', 'Excuse letter submitted successfully!');
    }

    // Handle Admin Accept/Reject actions
    public function update(Request $request, ExcuseLetter $excuseLetter)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $excuseLetter->update([
            'status' => $request->status,
        ]);

        // If accepted, automatically log their attendance as 'excused' for that date
        if ($request->status === 'accepted') {
            Attendance::updateOrCreate(
                [
                    'user_id' => $excuseLetter->user_id,
                    'date' => $excuseLetter->date,
                ],
                [
                    'status' => 'excused',
                    'remarks' => 'Excused via approved excuse letter',
                ]
            );
        }

        return back()->with('success', "Excuse letter has been {$request->status}!");
    }
}