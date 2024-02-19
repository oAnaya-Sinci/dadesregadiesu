<?php

namespace App\Models\Parques;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MQTT_Data extends Model
{
    use HasFactory;

    protected $table = 'MQTTData';
}
