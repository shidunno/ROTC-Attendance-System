<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ResolveTabAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        $contextId = $request->header('X-ROTC-Auth-Context')
            ?: $request->query('tab');

        if (
            is_string($contextId) &&
            preg_match('/^[a-f0-9-]{32,64}$/i', $contextId)
        ) {
            $contexts = $request->session()->get(
                'rotc_auth_contexts',
                []
            );

            $userId = $contexts[$contextId] ?? null;

            if ($userId) {
                $user = User::find($userId);

                if ($user) {
                    Auth::guard('web')->setUser($user);
                } else {
                    unset($contexts[$contextId]);

                    $request->session()->put(
                        'rotc_auth_contexts',
                        $contexts
                    );
                }
            }
        }

        return $next($request);
    }
}