<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $primaryKey = 'announcement_id';
    public $timestamps = false; // Using custom posted_at timestamp

    protected $fillable = [
        'posted_by',
        'title',
        'content',
        'attachments',
        'is_pinned',
        'scheduled_at',
        'edited_at',
        'posted_at',
    ];

    protected $casts = [
        'attachments' => 'array',
        'is_pinned' => 'boolean',
        'scheduled_at' => 'datetime',
        'posted_at' => 'datetime',
    ];

    /**
     * Relationship to User using 'posted_by' as foreign key.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }
}