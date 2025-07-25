<?php

namespace App\Models;

use App\Models\Address;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Round extends Model
{
    use HasFactory;

    public function addresses()
    {
        return $this->belongsToMany(Address::class,'address_round')
            ->withPivot('order')
            ->withTimestamps();
    }
}
