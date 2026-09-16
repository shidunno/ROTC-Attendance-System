<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExcuseLetter extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'file_url',
        'date',
        'reason',
        'status',
    ];

    // Define relationship back to the cadet/user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}