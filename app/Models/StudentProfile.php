<?php

namespace App\Models;

use Database\Factories\StudentProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    /** @use HasFactory<StudentProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'school_stage',
        'grade',
        'school_name',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'grade' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
}