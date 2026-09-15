<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Platoon extends Model
{
    protected $fillable = [
        'number',
        'name',
        'leader_id',
    ];

    // Relationship: A platoon has a designated leader (User)
    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    // Relationship: A platoon has many members (Cadets/Users)
    public function users()
    {
        return $this->hasMany(User::class, 'platoon_id');
    }
}