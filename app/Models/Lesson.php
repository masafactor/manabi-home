<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'teacher_id',
        'school_stage',
        'grade',
        'unit_name',
        'title',
        'description',
        'video_url',
        'thumbnail_url',
        'status',
        'published_at',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'grade' => 'integer',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function schoolStageLabel(): string
    {
        return match ($this->school_stage) {
            'elementary' => '小学校',
            'junior_high' => '中学校',
            'high_school' => '高校',
            default => '未設定',
        };
    }

    public function gradeLabel(): string
    {
        if (! $this->grade) {
            return '未設定';
        }

        return $this->schoolStageLabel() . $this->grade . '年';
    }

    public function lessonViews(): HasMany
    {
        return $this->hasMany(LessonView::class);
    }
}