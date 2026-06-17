<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Layout extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'column',
        'row',
        'photo_count',
        'isActive',
    ];
    protected $casts = [
        'isActive' => 'boolean',
    ];
}
