<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::with(['user', 'comments.user'])
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

                    'comments' => $announcement->comments->map(function ($comment) {
                        return [
                            'id'         => $comment->id,
                            'content'    => $comment->content,
                            'created_at' => $comment->created_at,
                            'user'       => [
                                'id'        => $comment->user?->id,
                                'custom_id' => $comment->user?->custom_id
                                    ?? $comment->user?->name
                                    ?? 'Unknown',
                                'name'      => $comment->user?->name
                                    ?? 'Unknown User',
                                'role'      => $comment->user?->role
                                    ?? 'cadet',
                            ],
                        ];
                    })->values(),

                    'user' => [
                        'id'        => $announcement->user?->id,

                        // Primary label will use custom_id,
                        // falling back to name
                        'custom_id' => $announcement->user?->custom_id
                            ?? $announcement->user?->name
                            ?? 'Unknown',

                        'name' => $announcement->user?->name
                            ?? 'Unknown User',

                        'role' => $announcement->user?->role
                            ?? 'cadet',
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
            $filePaths['image'] = $request->file('image')
                ->store('announcements/images', 'public');
        }

        if ($request->hasFile('attachment')) {
            $filePaths['document'] = $request->file('attachment')
                ->store('announcements/attachments', 'public');
        }

        Announcement::create([
            'posted_by'    => auth()->id(),
            'title'        => $validated['title'] ?? 'General Announcement',
            'content'      => $validated['content'],
            'attachments'  => !empty($filePaths) ? $filePaths : null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        return back()->with(
            'success',
            'Announcement posted successfully!'
        );
    }

    /**
     * Store a comment for an announcement.
     */
    public function comment(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => [
                'required',
                'string',
                'max:5000',
            ],
        ]);

        $announcement = Announcement::findOrFail($id);

        Comment::create([
            'announcement_id' => $announcement->announcement_id,
            'user_id'         => auth()->id(),
            'content'         => trim($validated['content']),
        ]);

        return back()->with('success', 'Comment posted successfully.');
    }

    public function destroy($id)
    {
        $announcement = Announcement::where(
            'announcement_id',
            $id
        )->firstOrFail();

        $announcement->delete();

        return redirect()->route('announcement.index')
            ->with(
                'success',
                'Announcement deleted successfully.'
            );
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
            ->with(
                'success',
                'Announcement updated successfully.'
            );
    }

    public function togglePin($id)
    {
        $announcement = Announcement::findOrFail($id);

        $announcement->update([
            'is_pinned' => !$announcement->is_pinned,
        ]);

        return back()->with(
            'success',
            'Announcement pin status updated.'
        );
    }
}