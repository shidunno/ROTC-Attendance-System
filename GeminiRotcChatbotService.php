warning: in the working copy of 'app/Services/GeminiRotcChatbotService.php', CRLF will be replaced by LF the next time Git touches it
[1mdiff --git a/app/Services/GeminiRotcChatbotService.php b/app/Services/GeminiRotcChatbotService.php[m
[1mindex 6e55ef8..c0e6871 100644[m
[1m--- a/app/Services/GeminiRotcChatbotService.php[m
[1m+++ b/app/Services/GeminiRotcChatbotService.php[m
[36m@@ -74,8 +74,13 @@[m [mpublic function respond(\App\Models\User $user, string $message): string[m
                 break;[m
             }[m
 [m
[31m-            if ($response->status() === 503 && $attempt === 3) {[m
[31m-                return "The ROTC Assistant is temporarily unavailable. Please try again in a few minutes.";[m
[32m+[m[32m            if ($response->status() === 503) {[m
[32m+[m[32m                if ($attempt === 3) {[m
[32m+[m[32m                    return "The ROTC Assistant is temporarily unavailable. Please try again in a few minutes.";[m
[32m+[m[32m                }[m
[32m+[m
[32m+[m[32m                sleep($attempt);[m
[32m+[m[32m                continue;[m
             }[m
 [m
             if ($response->failed()) {[m
