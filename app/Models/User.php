<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Platoon;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'custom_id',
        'name',
        'email',
        'password',
        'role',
        'status',
        'profile_photo_path',
        'platoon_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationship: User belongs to a platoon (as a member)
    public function platoon()
    {
        return $this->belongsTo(Platoon::class, 'platoon_id');
    }

    // Relationship: User leads a platoon (if they are a leader)
    public function ledPlatoon()
    {
        return $this->hasOne(Platoon::class, 'leader_id');
    }
}