<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningLogComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_log_id',
        'teacher_id',
        'comment',
    ];

    public function learningLog(): BelongsTo
    {
        return $this->belongsTo(LearningLog::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}