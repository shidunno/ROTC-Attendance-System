<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnouncementCommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_comment_on_an_announcement(): void
    {
        $user = User::factory()->create();

        $announcement = Announcement::create([
            'posted_by' => $user->id,
            'title' => 'Test Announcement',
            'content' => 'Test content',
        ]);

        $this->actingAs($user)
            ->post(
                route(
                    'announcement.comments.store',
                    $announcement
                ),
                [
                    'content' => 'Hello everyone',
                ]
            )
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('comments', [
            'announcement_id' => $announcement->announcement_id,
            'user_id' => $user->id,
            'content' => 'Hello everyone',
        ]);
    }

    public function test_empty_or_whitespace_comment_is_rejected(): void
    {
        $user = User::factory()->create();

        $announcement = Announcement::create([
            'posted_by' => $user->id,
            'title' => 'Test Announcement',
            'content' => 'Test content',
        ]);

        $this->actingAs($user)
            ->post(
                route(
                    'announcement.comments.store',
                    $announcement
                ),
                [
                    'content' => '   ',
                ]
            )
            ->assertSessionHasErrors('content');

        $this->assertDatabaseCount('comments', 0);
    }
}