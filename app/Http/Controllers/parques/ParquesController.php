<?php

namespace App\Http\Controllers\parques;

use App\Http\Controllers\Controller;
use App\Models\Parques\StatusSB;
use App\Models\Parques\StatusWS;
use App\Models\Parques\Schedule;
use App\Models\Parques\ScheduleWS;
use App\Models\Parques\MQTT_data;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ParquesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $SB_data = StatusSB::all();
        $WS_Schedule = ScheduleWS::orderBy('devicename')->orderBy('id_ev')->get();
        $WS_data = StatusWS::whereNotIn('id_ws', [1, 2])->get();
        $VoltBattery = 3.4;

        // die( var_dump( Auth::check() ) );

        return view('parques.app', compact('SB_data', 'WS_data', 'WS_Schedule', 'VoltBattery'));
    }

    public function obtainData(){
        $SB_data = StatusSB::all();
        $WS_data = StatusWS::whereNotIn('id_ws', [1, 2])->get();
        $VoltBattery = 3.4;

        $Session_Auth = Auth::check();

        return json_encode( [$WS_data, $SB_data, $VoltBattery, $Session_Auth] );
    }

    public function obtainIrrigateData($id_register){

        $irrigate_Data = Schedule::where('id_register', $id_register)->get();

        return json_decode( $irrigate_Data );
    }

    public function obtainDataMQTT_Table(){

      $dataPayload = (MQTT_data::select('payload')->where('DeviceName', 'LIKE', 'plazamayor%')->orderby('timefromttnUTC', 'DESC')->first())->payload;

      return $dataPayload;
    }

    /**ex
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dataObtained = $this->obtainIrrigateData( $request->id_register );

        if($dataObtained == []){
            $SaveDataSchedule = new Schedule();
            $SaveDataSchedule->id_register = $request->id_register;
            $SaveDataSchedule->data_schedules = json_encode($request->dataToRegister); 
            $SaveDataSchedule->readed = 0;
            $SaveDataSchedule->save();
        } else {
            $this->update($request, $dataObtained[0],  $dataObtained[0]->id);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $dataObtained, string $id)
    {
        $updateDataSchedule = Schedule::find($id);
        $updateDataSchedule->data_schedules = json_encode($request->dataToRegister); 
        $updateDataSchedule->readed = 0;
        $updateDataSchedule->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function logout_session(Request $request) {
        Auth::logout();
        return Redirect::to('/login');
    }
}
