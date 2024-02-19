
document.addEventListener("DOMContentLoaded", function (event) {

   document.querySelector('.btnAddHours').disabled = false;
   document.querySelector('.btnSaveData').disabled = false;

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

   let daysSelected = (num) => {

      let valueBinary = [64, 32, 16, 8, 4, 2, 1];
   
      for(let i=0; i<valueBinary.length; i++){

         if(num >= valueBinary[i]){
            
            document.querySelector('input.B'+valueBinary[i]).checked = true;

            num -= valueBinary[i];
         }
      }
   }

   let obtainDataSchedule = async () => {

      let dataSchedule = await fetch("/parques/obtain_data_schedule").then(json => json.json()).then(data => data).catch( error => { console.warn(error); } );

      if( dataSchedule == undefined )
         return false;

      dataSchedule = JSON.parse(dataSchedule.data_schedules);
    
      document.querySelector('input.'+(dataSchedule.EV).toLowerCase()).click();
      document.querySelector('input.'+(dataSchedule.WS).toLowerCase()).checked = true;
      document.querySelector('#id_program').value = dataSchedule.id;
      document.querySelector('#description').value = dataSchedule.description;
      daysSelected(dataSchedule.days);

      let tbody = '';
      for(let i=0; i<dataSchedule.schedules.length; i++){

         let values = dataSchedule.schedules[i];
         tbody += `<tr><td>${values.timesched}</td><td>${values.minutessched}</td><td>${values.hum}</td> <label aria-label="Close"></label> </tr>`;
      }

      document.querySelector('.tableHoursIrrigate tbody').innerHTML = tbody;

      if (document.querySelectorAll('.tableHoursIrrigate tbody tr').length > 0) {
         document.querySelectorAll('.weekDays .form-check-input').forEach(elem => {
            elem.setAttribute('disabled', '');
         });
      }

      document.querySelector('.btnAddHours').disabled = true;
      document.querySelector('.btnSaveData').disabled = true;
   }
   obtainDataSchedule();

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
            'id_register': `${idProgram}-${dataWS}-${electroValve}`,
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