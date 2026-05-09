<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->date('log_date');

            $table->text('did_text')->nullable();
            $table->text('understood_text')->nullable();
            $table->text('difficult_text')->nullable();
            $table->text('question_text')->nullable();

            $table->string('mood')->nullable();

            $table->timestamps();

            $table->unique(['student_id', 'log_date']);
            $table->index(['student_id', 'log_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_logs');
    }
};