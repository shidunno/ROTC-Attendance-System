<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TabAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_different_tab_contexts_keep_different_users_in_the_same_session(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $cadet = User::factory()->create([
            'email' => 'cadet@example.com',
            'role' => 'cadet',
        ]);

        $adminContext =
            '11111111-1111-4111-8111-111111111111';

        $cadetContext =
            '22222222-2222-4222-8222-222222222222';

        $this->post(
            '/Login',
            [
                'email' => $admin->email,
                'password' => 'password',
            ],
            [
                'X-ROTC-Auth-Context' =>
                    $adminContext,
            ]
        )
            ->assertRedirect(
                '/Dashboard?tab=' .
                $adminContext
            );

        $this->post(
            '/Login',
            [
                'email' => $cadet->email,
                'password' => 'password',
            ],
            [
                'X-ROTC-Auth-Context' =>
                    $cadetContext,
            ]
        )
            ->assertRedirect(
                '/Dashboard?tab=' .
                $cadetContext
            );

        $this->get(
            '/Dashboard?tab=' .
            $adminContext
        )
            ->assertInertia(
                fn ($page) => $page
                    ->where(
                        'props.auth.user.id',
                        $admin->id
                    )
                    ->where(
                        'props.auth.user.role',
                        'admin'
                    )
            );

        $this->get(
            '/Dashboard?tab=' .
            $cadetContext
        )
            ->assertInertia(
                fn ($page) => $page
                    ->where(
                        'props.auth.user.id',
                        $cadet->id
                    )
                    ->where(
                        'props.auth.user.role',
                        'cadet'
                    )
            );
    }

    public function test_logging_out_one_tab_does_not_log_out_another_tab(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $cadet = User::factory()->create([
            'email' => 'cadet@example.com',
            'role' => 'cadet',
        ]);

        $adminContext =
            '33333333-3333-4333-8333-333333333333';

        $cadetContext =
            '44444444-4444-4444-8444-444444444444';

        $this->post(
            '/Login',
            [
                'email' => $admin->email,
                'password' => 'password',
            ],
            [
                'X-ROTC-Auth-Context' =>
                    $adminContext,
            ]
        );

        $this->post(
            '/Login',
            [
                'email' => $cadet->email,
                'password' => 'password',
            ],
            [
                'X-ROTC-Auth-Context' =>
                    $cadetContext,
            ]
        );

        $this->post(
            '/Logout',
            [],
            [
                'X-ROTC-Auth-Context' =>
                    $cadetContext,
            ]
        )
            ->assertRedirect('/');

        $this->get(
            '/Dashboard?tab=' .
            $adminContext
        )
            ->assertInertia(
                fn ($page) => $page
                    ->where(
                        'props.auth.user.id',
                        $admin->id
                    )
            );

        $this->get(
            '/Dashboard?tab=' .
            $cadetContext
        )
            ->assertRedirect('/');
    }

    public function test_same_user_can_have_independent_tab_contexts(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $firstContext =
            '55555555-5555-4555-8555-555555555555';

        $secondContext =
            '66666666-6666-4666-8666-666666666666';

        $this->post(
            '/Login',
            [
                'email' => $admin->email,
                'password' => 'password',
            ],
            [
                'X-ROTC-Auth-Context' =>
                    $firstContext,
            ]
        );

        $this->post(
            '/Login',
            [
                'email' => $admin->email,
                'password' => 'password',
            ],
            [
                'X-ROTC-Auth-Context' =>
                    $secondContext,
            ]
        );

        $this->post(
            '/Logout',
            [],
            [
                'X-ROTC-Auth-Context' =>
                    $firstContext,
            ]
        );

        $this->get(
            '/Dashboard?tab=' .
            $secondContext
        )
            ->assertInertia(
                fn ($page) => $page
                    ->where(
                        'props.auth.user.id',
                        $admin->id
                    )
            );

        $this->get(
            '/Dashboard?tab=' .
            $firstContext
        )
            ->assertRedirect('/');
    }
}