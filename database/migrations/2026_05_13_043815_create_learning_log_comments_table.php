<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_log_comments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('learning_log_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('teacher_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('comment');

            $table->timestamps();

            $table->index(['learning_log_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_log_comments');
    }
};