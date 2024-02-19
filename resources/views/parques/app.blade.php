@extends('layouts.app')

@section('css_section')

<link rel="stylesheet" href="/css/parques/parques.css">

@endsection

@section('content')

<div class="container">

   <!-- Modulo de pestañas para parques -->
   <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
         <button class="nav-link active" id="parque1-tab" data-bs-toggle="tab" data-bs-target="#parque1" type="button"
            role="tab" aria-controls="parque1" aria-selected="true">Parc 1</button>
         <button class="nav-link" id="schedules-tab" data-bs-toggle="tab" data-bs-target="#schedules" type="button"
            role="tab" aria-controls="schedules" aria-selected="false">Schedules</button>
         <button class="nav-link" id="Caudalimetro-tab" data-bs-toggle="tab" data-bs-target="#Caudalimetro" type="button"
            role="tab" aria-controls="Caudalimetro" aria-selected="false">Caudalimetro</button>
      </div>
   </nav>
   <!-- Modulo de pestañas para parques -->

   <!-- Contenedores de los parques -->
   <div class="tab-content" id="myTabContent">
      <!-- Este apartado contiene el maquetado de la vista de la información de los parques -->
      <div class="tab-pane fade active show" id="parque1" role="tabpanel" aria-labelledby="parque1-tab">
         <div class="row pt-4">
            <div class="col-md-3">
               <div class="card shadow cardMap">
                  <div class="card-header"><strong>{{ __('ubicació') }}</strong></div>
                  <div class="card-body" style="margin: 0; padding: 2px;">
                     <div class="row mb-3">
                        <iframe
                           src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d231.81592112085!2d2.087172693865377!3d41.61728831550894!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses-419!2smx!4v1701409499988!5m2!1ses-419!2smx"
                           width="600" height="318" style="border:0;" allowfullscreen="" loading="lazy"
                           referrerpolicy="no-referrer-when-downgrade"></iframe>
                     </div>
                  </div>
               </div>
            </div>

            <!-- <div class="col-md-6"> -->
            <div class="col-md-6">
               <div class="card shadow cardWS">
                  <div class="card-header"><strong>{{ __('Informació') }}</strong></div>

                  <div class="card-body">
                     <div class="row mb-12">

                        <table id="WS_data_table" class="table table-striped">
                           <thead class="text-center">
                              <tr>
                                 <th></th>
                                 <th>dispositiu</th>
                                 <th>descripció</th>
                                 <th>dia</th>
                                 <th>hora</th>
                                 <th>voltatge MCU</th>
                                 <th>sortides</th>
                                 <th>ID taula temps</th>
                              </tr>
                           </thead>
                           <tbody class="text-center">
                              @foreach($WS_data as $ws)
                              <tr>
                                 <td class="checkTr">
                                    <div class="form-check">
                                       <input class="form-check-input {{$ws->devicename}}" type="checkbox" value="{{$ws->devicename}}"
                                          id="flexCheckDefault">
                                    </div>
                                 </td>
                                 <td>{{$ws->devicename}}</td>
                                 <td>{{$ws->ws_description}}</td>
                                 <td>{{$ws->dayoftheweek}}</td>
                                 <td>{{date('H:i:s', strtotime($ws->timefromdevice))}}</td>
                                 <td>{{round($ws->mcu_voltage, 2)}} <progress class="level_battery pt-1 ps-1" value="{{$ws->mcu_voltage}}" min="0" max="{{$VoltBattery}}"></progress></td>
                                 <td>{{$ws->outputs}}</td>
                                 <td>{{$ws->timetable_id_device}}</td>
                              </tr>
                              @endforeach
                           </tbody>
                        </table>

                     </div>
                  </div>

               </div>
            </div>

            <div class="col-md-3">
               <div class="card shadow cardEV">
                  <div class="card-header"><strong>{{ __('EV') }}</strong></div>

                  <div class="card-body electroValves pb-4">

                     <div class="row mb-12 ms-n1">
                        <div class="col-md-3">

                           <div class="form-check form-switch d-flex flex-column align-items-start">
                              <label class="form-check-label pt-2" for="flexSwitchCheckDefault ms-n4">EV-1</label>
                              <input class="form-check-input valve1 ev1" type="checkbox" value="EV1" checked>
                           </div>

                        </div>
                        <div class="col-md-3">

                           <div class="form-check form-switch d-flex flex-column align-items-start">
                              <label class="form-check-label pt-2" for="flexSwitchCheckDefault">EV-2</label>
                              <input class="form-check-input valve2 ev2" type="checkbox" value="EV2">
                           </div>

                        </div>

                        <div class="col-md-3">

                           <div class="form-check form-switch d-flex flex-column align-items-start">
                              <label class="form-check-label pt-2" for="flexSwitchCheckDefault">EV-3</label>
                              <input class="form-check-input valve3 ev3" type="checkbox" value="EV3">
                           </div>

                        </div>
                        <div class="col-md-3">

                           <div class="form-check form-switch d-flex flex-column align-items-start">
                              <label class="form-check-label pt-2" for="flexSwitchCheckDefault">EV-4</label>
                              <input class="form-check-input valve4 ev4" type="checkbox" value="EV4">
                           </div>

                        </div>

                     </div>
                  </div>
               </div>

               <div class="card shadow mt-4 cardHours" style="height: 12.7rem;">
                  <div class="card-header"><strong>{{ __("registre d'hores") }}</strong></div>

                  <div class="card-body pt-0">

                     <table class="table table-striped tableHoursIrrigate text-center">
                        <thead>
                           <tr>
                              <th>des de</th>
                              <th>durant</th>
                              <th>humitat</th>
                              <th></th>
                           </tr>
                        </thead>

                        <tbody>
                        </tbody>

                     </table>

                  </div>
               </div>

            </div>
         </div>

         <!-- <div class="row pt-4"> -->
         <!-- <div class="row justify-content-end pt-4 rowSensors"> -->
         <div class="row justify-content pt-4 justify-content-end">

         <div class="col-md-9" id="irrigate_conf">
               <div class="card shadow cardIrrigate">
                  <div class="card-header"><strong>{{ __('Configuración de riego') }}</strong></div>

                  <div class="card-body">

                     <div class="row pb-3">
                        <div class="col-md-2 id_progam">
                           <label for="id_program">ID</label>
                           <input type="text" name="" id="id_program" class="form-control" value="0" style="text-align: center;" disabled>
                        </div>

                        <div class="col-md-10">
                           <label for="">Descripció</label>
                           <input type="text" name="" id="description" class="form-control">
                        </div>
                     </div>

                     <div class="row pt-2 pb-3">
                        <div class="col-md-12">
                           <div class="weekDays">

                              <div class="form-check form-switch ps-4">
                                 <label class="form-check-label ps-2" for="flexSwitchCheckDefault">dilluns</label>
                                 <input class="form-check-input B1" type="checkbox" value="1">
                              </div>

                              <div class="form-check form-switch ps-4">
                                 <label class="form-check-label ps-2" for="flexSwitchCheckDefault">dimarts</label>
                                 <input class="form-check-input B2" type="checkbox" value="2">
                              </div>

                              <div class="form-check form-switch ps-4">
                                 <label class="form-check-label ps-2" for="flexSwitchCheckDefault">dimecres</label>
                                 <input class="form-check-input B4" type="checkbox" value="4">
                              </div>

                              <div class="form-check form-switch ps-4">
                                 <label class="form-check-label ps-2" for="flexSwitchCheckDefault">dijous</label>
                                 <input class="form-check-input B8" type="checkbox" value="8">
                              </div>

                              <div class="form-check form-switch ps-4">
                                 <label class="form-check-label ps-2" for="flexSwitchCheckDefault">divendres</label>
                                 <input class="form-check-input B16" type="checkbox" value="16">
                              </div>

                              <div class="form-check form-switch ps-4">
                                 <label class="form-check-label ps-2" for="flexSwitchCheckDefault">dissabte</label>
                                 <input class="form-check-input B32" type="checkbox" value="32">
                              </div>

                              <div class="form-check form-switch ps-4">
                                 <label class="form-check-label ps-2" for="flexSwitchCheckDefault">diumenge</label>
                                 <input class="form-check-input B64" type="checkbox" value="64">
                              </div>
                           </div>
                        </div>

                     </div>

                     <div class="row pb-0 pt-1">
                        <div class="col-md-6">
                           <label for="customRange1" class="form-label">horari de reg</label>
                           <div class="form-group horario_riego">
                              <!-- <label class="pt-2">De:</label> -->
                              <input type="time" name="" id="desde" class="form-control" value="08:00">

                              <!-- <label class="pt-2">Hasta:</label>
                              <input type="number" name="" id="hasta" class="form-control" min="15" max="60" step="5"> -->

                              <label class="pt-2">Durant:</label>
                              <select name="" id="hasta" class="form-select">
                                 <option value="0">0 min.</option>
                                 <option value="15">15 min.</option>
                                 <option value="30">30 min.</option>
                                 <option value="45">45 min.</option>
                                 <option value="60">60 min.</option>
                              </select>
                           </div>
                        </div>

                        <div class="col-md-4">
                           <label for="customRange1" class="form-label porcentHumedity">percentatge d'humitat: <span class="valuePorcent">0%</span></label>
                           <input type="range" class="form-range pt-2" id="rangeHumidity" min="0" max="100" value="0" step="1">
                        </div>

                        <div class="col-md-2">
                          <button type="button" class="btn btn-primary mt-4 btnAddHours">Afegir</button>
                        </div>
                     </div>
                  </div>
                  
            </div>
         </div>

            <div class="col-md-3">
               <div class="card shadow cardSB">
                  <div class="card-header"><strong>{{ __('Informació de sensors SB') }}</strong></div>

                  <div class="card-body pb-0 pt-1">
                     <div class="row mb-12">

                        <table id="SB_data_table" class="table table-striped">
                           <thead class="text-center">
                              <tr>
                                 <th>Dispositivo</th>
                                 <th>Bateria</th>
                                 <th>Humedad suelo</th>
                              </tr>
                           </thead>
                           <tbody class="text-center">
                              @foreach($SB_data as $sb)
                              <tr>
                                 <td>{{$sb->devicename}}</td>
                                 <td>{{round($sb->device_battery, 2)}} <progress class="level_battery pt-1 ps-1" value="{{$sb->device_battery}}" min="0" max="{{$VoltBattery}}" style="width: 50%"></progress></td>
                                 <td>{{round( $sb->soil_moisture, 2 )}}</td>
                              </tr>
                              @endforeach
                           </tbody>
                        </table>

                     </div>
                  </div>
               </div>

               <div class="card shadow cardAccions mt-4">
                     <div class="card-header"><strong>{{ __('accions') }}</strong></div>

                     <div class="card-body">
                        <div class="row mb-12 accionsParks">
                           <div class="col-md-6"><button type="button" class="btn btn-success btnSaveData" style="width: 100%;">Guardar</button></div>
                           <div class="col-md-6"><button type="button" class="btn btn-warning btnRefreshData" style="width: 100%;">Refrescar</button></div>
                        </div>
                     </div>
                  </div>
               </div>
               
            </div>

         

         <!-- <div class="col-md-3">   
         </div> -->

      </div>
      <!-- Este apartado contiene el maquetado de la vista de la información de los parques -->

      <!-- Estos son modulos en blanco para la informacion de los parques -->
      <div class="tab-pane fade" id="schedules" role="tabpanel" aria-labelledby="schedules-tab">
            
         <div class="row pt-4">
            <div class="col-md-7">
               <div class="card shadow cardWS2">
                  <div class="card-header"><strong>{{ __('WS Schedule') }}</strong></div>

                  <div class="card-body">
                     <table id="WS_data_table_2" class="table table-striped">
                        <thead class="text-center">
                           <tr>
                              <th>dispositiu</th>
                              <th>descripció</th>
                              <th>dia</th>
                              <th>hora</th>
                              <th>voltatge MCU</th>
                              <th>sortides</th>
                              <th>ID taula temps</th>
                           </tr>
                        </thead>
                        <tbody class="text-center">
                           @foreach($WS_data as $ws2)
                           <tr>
                              <td>{{$ws2->devicename}}</td>
                              <td>{{$ws2->ws_description}}</td>
                              <td>{{$ws2->dayoftheweek}}</td>
                              <td>{{date('H:i:s', strtotime($ws2->timefromdevice))}}</td>
                              <td>{{round($ws2->mcu_voltage, 2)}} <progress class="level_battery pt-1 ps-1" value="{{$ws2->mcu_voltage}}" min="0" max="{{$VoltBattery}}"></progress></td>
                              <td>{{$ws2->outputs}}</td>
                              <td>{{$ws2->timetable_id_device}}</td>
                           </tr>
                           @endforeach
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
           
            <!-- Una sola fila borrar esto -->
            </div>
            <div class="row pt-4">
               <!-- End -->

            <div class="col-md-12">
               <div class="card shadow cardWS_Schedule">
                  <div class="card-header"><strong>{{ __('WS Schedule') }}</strong></div>

                  <div class="card-body"">
                     <table id="WS_data_schedule" class="table table-striped">
                        <thead class="text-center">
                           <tr>
                            <th>id_ws_sched</th>
                            <th>devicename</th>
                            <th>id_ev</th>
                            <th>timefromttn</th>
                            <th>schedule</th>
                            <th>diumenge <- diluns</th>
                           </tr>
                        </thead>
                        <tbody class="text-center">
                           @foreach($WS_Schedule as $ws_s)
                           <tr>
                              <td>{{$ws_s->id_ws_sched}}</td>
                              <td>{{$ws_s->devicename}}</td>
                              <td>{{$ws_s->id_ev}}</td>
                              <td>{{$ws_s->timefromttn}}</td>
                              <td>{{$ws_s->schedule}}</td>
                              <td>{{$ws_s->weekdays}}</td>
                           </tr>
                           @endforeach
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>

         <!-- Estos son modulos en blanco para la informacion de los parques -->
      </div>

      <!-- Estos son modulos en blanco para la informacion de los parques -->
      <div class="tab-pane fade" id="Caudalimetro" role="tabpanel" aria-labelledby="Caudalimetro-tab">
            
         <div class="row pt-4">
            <div class="col-md-6">
               <div class="card shadow cardWS2">
                  <div class="card-header"><strong>{{ __('Caudalimetro') }}</strong></div>

                  <div class="card-body">
                  
                     <iframe src="https://sincisp.dyndns.org/d-solo/ff6467ab-ff4b-44c0-9cba-f7336456a0d9/caudalimetro-plaza-mayor?orgId=1&from=1707419181121&to=1708023981121&panelId=1" height="250" frameborder="0" style="width: 100%;"></iframe>

                  </div>
               </div>
            </div>
            
            <div class="col-md-6">
               <div class="card shadow cardWS2">
                  <div class="card-header"><strong>{{ __('Caudalimetro') }}</strong></div>

                  <div class="card-body">

                        <table class="table">
                           <thead>
                              <tr>
                                 <th>Battery</th>
                                 <th>Counter</th>
                                 <th>Alarm 1</th>
                                 <th>Alarm 2</th>
                              </tr>
                           </thead>
                           <tbody>

                           </tbody>
                        </table>

                  </div>
               </div>
            </div>
         </div>

      </div>

   </div>

   @endsection

   @section('js_section')

      <script src="/js/parques/parques.js"></script>

   @endsection
