<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Frame extends Model
{
    protected $fillable = [
        'name',
        'backgroundColor',
        'borderColor',
        'borderWidth',
        'titleText',
        'bottomText',
        'fontSize'
    ];
}
