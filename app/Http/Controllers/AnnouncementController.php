<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::with('user')
        ->orderBy('is_pinned', 'desc')
        ->orderBy('posted_at', 'desc')
        ->get()
            ->map(function ($announcement) {
                return [
                    'announcement_id' => $announcement->announcement_id,
                    'title'           => $announcement->title,
                    'content'         => $announcement->content,
                    'attachments'     => $announcement->attachments,
                    'is_pinned'       => $announcement->is_pinned,
                    'posted_at'       => $announcement->posted_at,
                    'user'            => [
                        'id'        => $announcement->user?->id,
                        // Primary label will use custom_id, falling back to name
                        'custom_id' => $announcement->user?->custom_id ?? $announcement->user?->name ?? 'Unknown',
                        'name'      => $announcement->user?->name ?? 'Unknown User',
                        'role'      => $announcement->user?->role ?? 'cadet',
                    ],
                ];
            });

        return Inertia::render('Announcement', [
            'user'          => auth()->user(),
            'announcements' => $announcements,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => ['nullable', 'string', 'max:255'],
            'content'      => ['required', 'string'],
            'attachment'   => ['nullable', 'file', 'max:10240'],
            'image'        => ['nullable', 'image', 'max:5120'],
            'scheduled_at' => ['nullable', 'date'],
        ]);

        $filePaths = [];

        if ($request->hasFile('image')) {
            $filePaths['image'] = $request->file('image')->store('announcements/images', 'public');
        }

        if ($request->hasFile('attachment')) {
            $filePaths['document'] = $request->file('attachment')->store('announcements/attachments', 'public');
        }

        Announcement::create([
            'posted_by'    => auth()->id(), // Links to users.id foreign key
            'title'        => $validated['title'] ?? 'General Announcement',
            'content'      => $validated['content'],
            'attachments'  => !empty($filePaths) ? $filePaths : null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        return back()->with('success', 'Announcement posted successfully!');
    }

    public function destroy($id)
    {
        $announcement = Announcement::where('announcement_id', $id)->firstOrFail();

        $announcement->delete();

        return redirect()->route('announcement.index')
            ->with('success', 'Announcement deleted successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $announcement = Announcement::findOrFail($id);

        $announcement->update([
            'title' => $validated['title'] ?? 'General Announcement',
            'content' => $validated['content'],
            'edited_at' => now(),
        ]);

        return redirect()->route('announcement.index')
            ->with('success', 'Announcement updated successfully.');
    }

    public function togglePin($id)
    {
        $announcement = Announcement::findOrFail($id);

        $announcement->update([
            'is_pinned' => !$announcement->is_pinned,
        ]);

        return back()->with('success', 'Announcement pin status updated.');
    }
}