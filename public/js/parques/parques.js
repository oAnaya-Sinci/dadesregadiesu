
document.addEventListener("DOMContentLoaded", function (event) {

   // document.querySelector('.btnAddHours').disabled = false;
   // document.querySelector('.btnSaveData').disabled = false;

   document.addEventListener("click", function(event) {
      inciateIntervalRefresh();
   });

   let intervalRefresh = setInterval(() => { console.log('1'); }, 5000);
   // let timeOut_LogOut = setTimeout(() => { console.log('1'); }, 5000);

   let inciateIntervalRefresh = () => {

      clearInterval(intervalRefresh);
      // clearTimeout(timeOut_LogOut);

      intervalRefresh = setInterval(async () => {

         let dataSensores = await fetch('/parques/obtain_data_info').then( json => json.json() ).then( data => data );

         let tbodyTable = "";
         dataSensores[0].forEach( elem => {
            tbodyTable += '<tr>';
            tbodyTable += `<td class="checkTr"><div class="form-check"><input class="form-check-input ${elem.devicename}" type="checkbox" value="${elem.devicename}"id="flexCheckDefault"></div></td>`;
            tbodyTable += `<td>${elem.devicename}</td>`;
            tbodyTable += `<td>${elem.ws_description}</td>`;
            tbodyTable += `<td>${elem.dayoftheweek}</td>`;
            tbodyTable += `<td>${elem.timefromdevice.substr(0,8)}</td>`;
            tbodyTable += `<td>${Number(elem.mcu_voltage).toFixed(1)} <progress class="level_battery pt-1 ps-1" value="${elem.mcu_voltage}" min="0" max="${dataSensores[2]}"></progress></td>`;
            tbodyTable += `<td>${elem.outputs}</td>`;
            tbodyTable += `<td>${elem.timetable_id_device}</td>`;
            tbodyTable += '</tr>';
         });

         let checkedWS;
         document.querySelectorAll('#WS_data_table tbody tr .form-check .form-check-input').forEach(elem => {
            
            if(elem.checked)
               checkedWS = elem.value;
         });
         document.querySelector('#WS_data_table tbody tr').remove();
         document.querySelector('#WS_data_table tbody').innerHTML = tbodyTable;
         document.querySelector('#WS_data_table tbody tr .form-check .'+ checkedWS).checked = true;

         inciateRowTable();
      }, 180000); // Every 3 minutes the data is refreshed
      // }, 15000);
   }
   inciateIntervalRefresh();

   let inciateRowTable = () => {
      document.querySelectorAll('#WS_data_table tbody tr').forEach(tr => {
         tr.addEventListener('click', () => {
            uncheckAllTr();
            tr.querySelector('td.checkTr .form-check-input').checked = true;
         });
      });

      let uncheckAllTr = () => {

         document.querySelectorAll('#WS_data_table tbody tr td .form-check-input:checked').forEach(chkElem => {
            chkElem.checked = false;
         });
      }

      document.querySelectorAll('#WS_data_table tbody tr td:nth-child(6)').forEach(elem => {
         let porcentaje = (elem.innerText * 100) / elem.querySelector('.level_battery').max;
         setColorPorcertanje(porcentaje, elem);
      });

      document.querySelectorAll('#SB_data_table tbody tr td:nth-child(2)').forEach(elem => {
         let porcentaje = (elem.innerText * 100) / elem.querySelector('.level_battery').max;
         let actualClass = elem.querySelector('.level_battery').classList[3];
         
         if(actualClass !=  undefined)
            elem.querySelector('.level_battery').classList.toggle(actualClass);

         setColorPorcertanje(porcentaje, elem);
      });

      function setColorPorcertanje(value, elem) {

         if (value < 20) {
            elem.querySelector('.level_battery').classList.toggle('low');
         } else if (value > 20 && value < 60) {
            elem.querySelector('.level_battery').classList.toggle('low_medium');
         } else if (value > 60 && value < 80) {
            elem.querySelector('.level_battery').classList.toggle('medium');
         } else if (value > 80) {
            elem.querySelector('.level_battery').classList.toggle('all');
         }
      }
   };
   inciateRowTable();

   // let decimalToBinary = (num) => {

   //    let valueBinary = [64, 32, 16, 8, 4, 2, 1];
   //    let binayRep = '';
   //    let daysActive = [];

   //    for(let i=0; i<valueBinary.length; i++){

   //       if(num >= valueBinary[i]){
   //          binayRep += '1';
   //          daysActive.push(valueBinary[i]);
   //          num -= valueBinary[i];
   //       } else{
   //          binayRep += '0';
   //       }
   //    }

   //    return daysActive;  
   // }

   // let daysSelected = (num) => {

   //    let valueBinary = [64, 32, 16, 8, 4, 2, 1];
   
   //    for(let i=0; i<valueBinary.length; i++){

   //       if(num >= valueBinary[i]){
            
   //          document.querySelector('input.B'+valueBinary[i]).checked = true;

   //          num -= valueBinary[i];
   //       }
   //    }
   // }

   let obtainDataSchedule = async () => {

      let dataSchedule = await fetch("/parques/obtain_data_schedule").then(json => json.json()).then(data => data).catch( error => { console.warn(error); } );

      if( !dataSchedule.length )
         return false;

      console.log(dataSchedule);
      document.querySelector('.module_encolados .card:first-child').classList.toggle('noDataNoShow');

      let tbody = '';
      dataSchedule.forEach(elem => {

         dataSchedule = JSON.parse(elem.data_schedules);
         
         for(let i=0; i<dataSchedule.schedules.length; i++){

            let values = dataSchedule.schedules[i];
            tbody += `<tr><td>${dataSchedule.WS}</td><td>${dataSchedule.EV}</td><td>${values.timesched}</td><td>${values.minutessched}</td><td>${values.hum}</td> </tr>`;
         }
      });

      document.querySelector('.tableEncolados tbody').innerHTML = tbody;

   //    <td> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-hourglass-split" viewBox="0 0 16 16">
   //    <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
   // </svg> </td>
   }
   obtainDataSchedule();

   let obtainDataMQTT = async () => {

      let dataMQTT = await fetch("/parques/obtain_data_mqqt").then(json => json.json()).then(data => data).catch( error => { console.warn(error); } );

      let tbody = "<tr>";
      tbody += `<td>${dataMQTT.Battery}</td>`;
      tbody += `<td>${dataMQTT.Count}</td>`;
      tbody += `<td>${dataMQTT.Error_Status_ST1}</td>`;
      tbody += `<td>${dataMQTT.Error_Status_ST2}</td>`;
      tbody += `<td>${dataMQTT.Unit}</td>`;
      tbody += `<td>${dataMQTT.absolute_meter_counter}</td>`;
      tbody += "</tr>";

      document.querySelector('#tableDataMQTT tbody').innerHTML = tbody;
   };
   obtainDataMQTT();

   document.querySelector('#rangeHumidity').addEventListener('change', elem => {
      document.querySelector('.porcentHumedity .valuePorcent').innerText = elem.target.value + "%";
   });

   let generateId = () => {

      let date = new Date();
      let newId = date.getFullYear().toString()[3] + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());

      return newId;
   }

   document.querySelector('#id_program').value = generateId();

   document.querySelectorAll('.electroValves .form-switch .form-check-input').forEach(checkInput => {

      checkInput.addEventListener('click', check => {
         uncheckAllValves();
         check.srcElement.checked = true;
      });
   });

   let uncheckAllValves = () => {

      document.querySelectorAll('.electroValves .form-switch .form-check-input:checked').forEach(chkElem => {
         chkElem.checked = false;
      });
   }

   document.querySelector('.accionsParks .btnSaveData').addEventListener('click', async () => {

      try {
         let idProgram = document.querySelector('#id_program').value;
         let dataWS = document.querySelector('#WS_data_table tbody .form-check-input:checked').value;
         let electroValve = document.querySelector('.electroValves .form-check-input:checked').value;
         let daysSelected = [];
         document.querySelectorAll('.weekDays .form-check-input:checked').forEach(elem => { daysSelected.push(elem.value); });
         let schedules = []

         document.querySelectorAll('.tableHoursIrrigate tbody tr').forEach( elem => {
            
            let elements = elem.querySelectorAll('td');
            let data = {};

            data.timesched = elements[0].textContent;
            data.minutessched = elements[1].textContent;
            data.hum = elements[2].textContent;

            schedules.push( data );
         });

         if(schedules.length == 0)
            throw error;

         let description = document.querySelector('#description').value;

         let dataIrrigate = {
            // 'id_register': `${idProgram}-${dataWS}-${electroValve}`,
            'id_register': `${dataWS}-${electroValve}`,
            'dataToRegister': {
               'id': idProgram,
               'WS': dataWS,
               'EV': electroValve,
               'days': daysSelected.reduce( (accm, elem) => Number(elem) + accm, 0 ),
               'description': description,
               'schedules': schedules
            }
         };

         let header = {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               'X-CSRF-TOKEN': document.querySelector("meta[name='csrf-token']").attributes[1].value
            },
            body: JSON.stringify(dataIrrigate),
         }

         await fetch('/parques/save_data', header);

         document.querySelector('.btnRefreshData').click();

      } catch (error) {
         console.error(error);
         alert("Favor de seleccionar la información necesaria para continuar con el registro del riego");
      }
   });

   document.querySelector('.accionsParks .btnRefreshData').addEventListener('click', () => {
      window.location.reload();
   });

   document.querySelector('#irrigate_conf .btnAddHours').addEventListener('click', () => {

      let desde = document.querySelector('#desde').value;
      let hasta = document.querySelector('#hasta').value;
      let humedity = document.querySelector('#rangeHumidity').value;

      let table = document.querySelector('.tableHoursIrrigate tbody');

      let newTbody = "";
      let tr_add = document.querySelectorAll('.tableHoursIrrigate tbody tr');

      if (tr_add.length < 3) {
         tr_add.forEach(elem => {
            newTbody += `<tr>${elem.innerHTML}</tr>`;
         });

         table.innerHTML = `${newTbody}<tr><td>${desde}</td><td>${hasta}</td><td>${humedity}%</td><td><button type="button" class="btn-close" aria-label="Close"></button></td></tr>`;
      }

      if (document.querySelectorAll('.tableHoursIrrigate tbody tr').length > 0) {
         document.querySelectorAll('.weekDays .form-check-input').forEach(elem => {
            elem.setAttribute('disabled', '');
         });
      }

      document.querySelectorAll('.tableHoursIrrigate tbody tr .btn-close').forEach(button => {

         button.addEventListener('click', () => {
            button.parentElement.parentElement.remove();

            if (document.querySelectorAll('.tableHoursIrrigate tbody tr').length == 0) {
               document.querySelectorAll('.weekDays .form-check-input').forEach(elem => {
                  elem.removeAttribute('disabled');
               });
            }
         });
      });
   });
})