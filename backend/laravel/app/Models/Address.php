<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory;

    // Allow these fields for mass-assignment
    protected $fillable = [
        'address_text',
        'latitude',
        'longitude',
        'order',
        'delivered',
        'comments',
    ];

    public function round()
    {
        return $this->belongsToMany(Round::class,'address_round')
            ->withPivot('order')
            ->withTimestamps();
    }
}
