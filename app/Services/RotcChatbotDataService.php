<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RotcChatbotDataService
{
    /**
     * Return only information that the authenticated user
     * is authorized to access.
     */
    public function getAuthorizedContext(User $user): array
    {
        // Only Cadets and Platoon Leaders may use the ROTC Assistant.
        if (!in_array($user->role, ['cadet', 'leader'], true)) {
            abort(403, 'You are not authorized to use the ROTC Assistant.');
        }

        return [
            'user' => $this->getUserContext($user),
            'attendance' => $this->getAttendanceContext($user),
            'platoon' => $this->getPlatoonContext($user),
            'announcements' => $this->getAnnouncements(),
            'attendance_rules' => $this->getAttendanceRules(),
        ];
    }

    protected function getUserContext(User $user): array
    {
        return [
            'id' => $user->id,
            'custom_id' => $user->custom_id,
            'name' => $user->name,
            'role' => $user->role,
            'platoon_id' => $user->platoon_id,
        ];
    }

    protected function getAttendanceContext(User $user): array
    {
        $records = Attendance::where('user_id', $user->id)
            ->orderByDesc('date')
            ->get([
                'date',
                'status',
                'time_in',
                'time_out',
                'remarks',
            ]);

        return [
            'total' => $records->count(),

            'present' => $records->filter(
                fn ($record) => strtolower((string) $record->status) === 'present'
            )->count(),

            'late' => $records->filter(
                fn ($record) => strtolower((string) $record->status) === 'late'
            )->count(),

            'absent' => $records->filter(
                fn ($record) => strtolower((string) $record->status) === 'absent'
            )->count(),

            'excused' => $records->filter(
                fn ($record) => strtolower((string) $record->status) === 'excused'
            )->count(),

            'records' => $records->map(function ($record) {
                return [
                    'date' => $record->date,
                    'status' => $record->status,
                    'time_in' => $record->time_in,
                    'time_out' => $record->time_out,
                    'remarks' => $record->remarks,
                ];
            })->values()->all(),
        ];
    }

    protected function getPlatoonContext(User $user): ?array
    {
        $platoon = $user->platoon;

        if (!$platoon && $user->role === 'leader') {
            $platoon = $user->ledPlatoon;
        }

        if (!$platoon) {
            return null;
        }

        $context = [
            'id' => $platoon->id,
            'number' => $platoon->number,
            'name' => $platoon->name,
        ];

        // Only Platoon Leaders receive member information.
        if ($user->role === 'leader') {
            $members = $platoon->users()
                ->whereIn('role', ['cadet', 'leader'])
                ->get([
                    'id',
                    'custom_id',
                    'name',
                    'role',
                    'status',
                ]);

            $context['members'] = $members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'custom_id' => $member->custom_id,
                    'name' => $member->name,
                    'role' => $member->role,
                    'status' => $member->status,
                ];
            })->values()->all();
        }

        return $context;
    }

    protected function getAnnouncements(): array
    {
        return Announcement::query()
            ->orderByDesc('is_pinned')
            ->orderByDesc('posted_at')
            ->limit(10)
            ->get([
                'announcement_id',
                'title',
                'content',
                'is_pinned',
                'scheduled_at',
                'posted_at',
            ])
            ->map(function ($announcement) {
                return [
                    'id' => $announcement->announcement_id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'is_pinned' => $announcement->is_pinned,
                    'scheduled_at' => $announcement->scheduled_at,
                    'posted_at' => $announcement->posted_at,
                ];
            })
            ->values()
            ->all();
    }

    protected function getAttendanceRules(): ?array
    {
        $rules = DB::table('attendance_rules')
            ->latest('updated_at')
            ->first();

        if (!$rules) {
            return null;
        }

        return [
            'time_in_start' => $rules->time_in_start,
            'time_in_end' => $rules->time_in_end,
            'late_after' => $rules->late_after,
        ];
    }
}