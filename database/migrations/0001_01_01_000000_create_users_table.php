<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create users table first so platoons can reference it
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('custom_id')->unique()->nullable(); 
            $table->string('name');
            $table->string('email')->unique(); 
            $table->string('password');
            $table->enum('role', ['cadet', 'leader', 'admin'])->default('cadet');
            $table->enum('status', ['Active', 'Archive'])->default('Active');
            $table->string('profile_photo_path', 2048)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Create platoons table referencing users as leaders
        Schema::create('platoons', function (Blueprint $table) {
            $table->id();
            $table->integer('number')->unique(); 
            $table->foreignId('leader_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 3. Add platoon_id to users table now that platoons exists (resolves the circular dependency)
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('platoon_id')->nullable()->after('profile_photo_path')->constrained('platoons')->nullOnDelete();
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id('announcement_id');
            $table->foreignId('posted_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->json('attachments')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('edited_at')->nullable();
            $table->timestamp('posted_at')->useCurrent();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date'); 
            $table->enum('status', ['present', 'absent', 'excused', 'late'])->default('absent');
            $table->text('remarks')->nullable(); 
            $table->timestamp('time_in')->nullable(); 
            $table->timestamp('time_out')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });
        
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('attendance_rules', function (Blueprint $table) {
            $table->id();
            $table->string('time_in_start')->nullable();
            $table->string('time_in_end')->nullable();
            $table->string('time_out_start')->nullable();
            $table->string('time_out_end')->nullable();
            $table->string('late_after')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop auxiliary tables first in reverse order of dependencies to avoid foreign key errors
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('announcements');
        
        // Safely drop the platoon_id foreign key constraint and column from users before dropping platoons table
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['platoon_id']);
            $table->dropColumn('platoon_id');
        });

        Schema::dropIfExists('platoons');
        Schema::dropIfExists('users');
    }
};