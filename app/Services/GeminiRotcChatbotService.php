<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiRotcChatbotService
{
    public function respond(\App\Models\User $user, string $message): string
    {
        $context = app(RotcChatbotDataService::class)
            ->getAuthorizedContext($user);

        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-2.5-flash-lite');

        if (!$apiKey) {
            throw new RuntimeException('Gemini is not configured.');
        }

        $systemPrompt = <<<PROMPT
You are the ROTC Support Chatbot for an ROTC Attendance System.

Answer the user's question using only the authorized ROTC system data supplied below.

Rules:
- Never invent attendance, schedules, policies, requirements, announcements, grades, platoon information, dates, or user information.
- If the supplied data does not contain enough information to answer, say that there is insufficient information available.
- Never reveal private information that is not present in the supplied authorized context.
- Do not claim that you performed an action when you only provided information.
- Keep answers clear, concise, and helpful.
- If the user asks about another person's private attendance or other private information that is not included in the authorized context, explain that you cannot provide it.
PROMPT;

        $response = Http::acceptJson()
            ->timeout(30)
            ->post(
                'https://generativelanguage.googleapis.com/v1beta/models/'
                . $model
                . ':generateContent?key='
                . urlencode($apiKey),
                [
                    'system_instruction' => [
                        'parts' => [
                            [
                                'text' => $systemPrompt,
                            ],
                        ],
                    ],
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                [
                                    'text' => $message
                                        . "\n\nAuthorized ROTC system data:\n"
                                        . json_encode(
                                            $context,
                                            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
                                        ),
                                ],
                            ],
                        ],
                    ],
                ]
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Gemini request failed: ' . $response->body()
            );
        }

        $data = $response->json();

        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!is_string($text) || trim($text) === '') {
            throw new RuntimeException('Gemini returned an empty response.');
        }

        return trim($text);
    }
}
