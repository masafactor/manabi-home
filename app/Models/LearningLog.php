<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'log_date',
        'did_text',
        'understood_text',
        'difficult_text',
        'question_text',
        'mood',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function moodLabel(): string
    {
        return match ($this->mood) {
            'good' => 'よい',
            'normal' => 'ふつう',
            'tired' => 'つかれた',
            'hard' => 'しんどい',
            default => '未選択',
        };
    }
}