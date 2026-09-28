<?php

namespace App\Http\Controllers;

use App\Services\OpenAiRotcChatbotService;
use App\Services\RotcChatbotDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RotcChatbotController extends Controller
{
    public function __construct(
        private readonly RotcChatbotDataService $dataService,
        private readonly GeminiRotcChatbotService $chatbot
    ) {
    }

    /**
     * GET /api/rotc-chatbot/context
     */
    public function context(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        return response()->json([
            'context' => $this->dataService->getAuthorizedContext($user),
        ]);
    }

    /**
     * POST /api/rotc-chatbot/message
     */
    public function message(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $role = strtolower((string) ($user->role ?? ''));

        if (!in_array($role, ['cadet', 'leader'], true)) {
            return response()->json([
                'message' => 'You are not authorized to use the ROTC Assistant.',
            ], 403);
        }

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
            report($e);

            return response()->json([
                'message' => "I'm currently unable to respond. Please try again later or contact your ROTC administrator.",
            ], 500);
        }
    }
}