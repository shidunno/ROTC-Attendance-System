<?php

namespace App\Http\Controllers;

use App\Services\RotcChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RotcChatbotController extends Controller
{
    public function __construct(
        private readonly RotcChatbotService $chatbot
    ) {
    }

    /**
     * POST /chatbot
     */
    public function chat(Request $request): JsonResponse
    {
        /*
         * Laravel authentication must determine the user.
         */
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        /*
         * Backend role authorization.
         *
         * Admin and all other roles are rejected.
         */
        $role = strtolower((string) ($user->role ?? ''));

        if (!in_array($role, ['cadet', 'leader'], true)) {
            return response()->json([
                'message' => 'You are not authorized to use the ROTC Assistant.',
            ], 403);
        }

        /*
         * Validate the incoming message.
         */
        $validator = Validator::make(
            $request->all(),
            [
                'message' => [
                    'required',
                    'string',
                    'max:2000',
                ],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Please enter a valid message.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $answer = $this->chatbot->respond(
                $user,
                $request->string('message')->toString()
            );

            return response()->json([
                'message' => $answer,
            ]);
        } catch (\Throwable $e) {
            /*
             * Do not expose exception details, SQL, paths,
             * environment variables, or credentials.
             */
            report($e);

            return response()->json([
                'message' => "I'm currently unable to respond. Please try again later or contact your ROTC administrator.",
            ], 500);
        }
    }
}