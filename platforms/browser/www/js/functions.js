/**
 * DESARROLLADOR @MARCO ANTONIO LÓPEZ PEREZ
 */
  /***********INICIA SECCION DE CREAR RECORDATORIO**************/
  var infoVisitas = null;
  var infoCitas = null;
  var infoLlamadas = null;
  var infoRecordatorios = null;
  var infoDemostraciones = null;
  document.addEventListener("deviceready",function(){
    if (!localStorage.getItem("rp_data_visitas")) {
      var rp_data_visitas = {data:[]};
      var rp_data_citas = {data:[]};
      var rp_data_llamadas = {data:[]};
      var rp_data_recordatorios = {data:[]};
      var rp_data_demostraciones = {data:[]};

      localStorage.setItem("rp_data_visitas",JSON.stringify(rp_data_visitas));
      localStorage.setItem("rp_data_citas",JSON.stringify(rp_data_citas));
      localStorage.setItem("rp_data_llamadas",JSON.stringify(rp_data_llamadas));
      localStorage.setItem("rp_data_recordatorios",JSON.stringify(rp_data_recordatorios));
      localStorage.setItem("rp_data_demostraciones",JSON.stringify(rp_data_demostraciones));

    }

    infoVisitas = JSON.parse(localStorage.getItem("rp_data_visitas"));
    infoCitas = JSON.parse(localStorage.getItem("rp_data_citas"));
    infoLlamadas = JSON.parse(localStorage.getItem("rp_data_llamadas"));
    infoRecordatorios = JSON.parse(localStorage.getItem("rp_data_recordatorios"));
    infoDemostraciones = JSON.parse(localStorage.getItem("rp_data_demostraciones"));


  },false);

  /*funcion agregar recordatorio*/
  /*
  Cuando el usuario hace click en el botón Agregar se produce una llamada a la funcion
  add_reminder();
  ****************+
  -->Estamos recuperando los valores de los campos y comprobando su integridad.
  -->Luego formateamos la fecha y la hora para conseguir una cadea con el formato adecuado para su uso en el constructor Date.
  -->La aplicación verifica que se cuenten con los permisos necesarios, si no es asi entonces pide permiso e invoca la funcion shedule que programa un recordario.
  */

  function add_reminder()
  {

    var date = $("#fechaRecordatorio").val();
    var time = $("#horaRecordatorio").val();
    var title = $("#tituloRecordatorio").val();
    var mensaje =  $("#descripcionRecordatorio").val();
    if (localStorage.getItem("accion") != "recordatorio") {
        var message = "Tienes agendada una "+localStorage.getItem("accion")+" para el dia "+date+"  a las "+time+ " con los siguientes detalles: "+mensaje;
    }else{
        var message = "Tienes agendada un "+localStorage.getItem("accion")+" para el dia "+date+"  a las "+time+ " con los siguientes detalles: "+mensaje;
    }


    if (date == "" || time == "" || title == "") {
      navigator.notification.alert("Porfavor ingrese todos los campos requeridos");

      return;
    }

    var schedule_time =  new Date((date + " " + time).replace(/-/g,"/")).getTime();
    schedule_time = new Date(schedule_time);
    var evento = localStorage.getItem("accion");
    switch (evento) {
      case 'cita':
        var id = infoCitas.data.length+1;
        break;
      case 'llamada':
        var id = infoLlamadas.data.length+1;
        break;
      case 'visita':
        var id = infoVisitas.data.length+1;
        break;
      case 'recordatorio':
        var id = infoRecordatorios.data.length+1;
        break;
      case 'demostracion':
        var id = infoDemostraciones.data.length+1;
        break;

    }


    cordova.plugins.notification.local.hasPermission(function(granted){
      if (granted == true) {
        schedule(id,title,message,schedule_time);
      }else{

        cordova.plugins.notification.local.registerPermission(function(granted){
          if (granted ==  true) {
            schedule(id,title,message,schedule_time);
          }else{
            navigator.notification.alert("Recuerda que para poder guardar el recordario debes de conceder los permisos necesarios a la aplicación");
          }
        });
      }
    });

  }

  function edit_reminder()
  {
    var idEvento = localStorage.getItem("idEvento");
    var date = $("#fechaRecordatorioEdicion").val();
    var time = $("#horaRecordatorioEdicion").val();
    var title = $("#tituloRecordatorioEdicion").val();
    var mensaje =  $("#descripcionRecordatorioEdicion").val();

    if (localStorage.getItem("evento") != "recordatorios") {
        var message = "Tienes agendada una "+localStorage.getItem("accion")+" para el dia "+date+"  a las "+time+ " con los siguientes detalles: "+mensaje;
    }else{
        var message = "Tienes agendada un "+localStorage.getItem("accion")+" para el dia "+date+"  a las "+time+ " con los siguientes detalles: "+mensaje;
    }


    if (date == "" || time == "" || title == "") {
      navigator.notification.alert("Porfavor ingrese todos los campos requeridos");

      return;
    }

    var schedule_time =  new Date((date + " " + time).replace(/-/g,"/")).getTime();
    schedule_time = new Date(schedule_time);

    var id = 2;

    cordova.plugins.notification.local.hasPermission(function(granted){
      if (granted == true) {
        scheduleEdit(id,title,message,schedule_time);

      }else{

        cordova.plugins.notification.local.registerPermission(function(granted){
          if (granted ==  true) {
            scheduleEdit(id,title,message,schedule_time);

          }else{
            navigator.notification.alert("Recuerda que para poder guardar el recordario debes de conceder los permisos necesarios a la aplicación");
          }
        });
      }
    });

  }

  /*FUNCION SHEDULE*/
  /*
  La funcion schedule programa una notification local y almacena los detalles del recordatorio
  en el almacenamiento local para posteriores consultas.
  */
  function schedule(id,title,message,schedule_time){
    cordova.plugins.notification.local.schedule({
      id: id,
      title: title,
      message: message,
      foreground: true,
      icon: 'https://sanfranciscodekkerlab.com/crm/vistas/img/icono.png',
      at: schedule_time,
      text: message

  });

  var array = [id,title,message,schedule_time];
  var evento = localStorage.getItem("accion");
  switch (evento) {
    case 'cita':
      infoCitas.data[infoCitas.data.length] = array;
      localStorage.setItem("rp_data_citas",JSON.stringify(infoCitas));

      break;
    case 'llamada':
      infoLlamadas.data[infoLlamadas.data.length] = array;
      localStorage.setItem("rp_data_llamadas",JSON.stringify(infoLlamadas));

      break;
    case 'visita':
      infoVisitas.data[infoVisitas.data.length] = array;
      localStorage.setItem("rp_data_visitas",JSON.stringify(infoVisitas));
      break;
    case 'recordatorio':
      infoRecordatorios.data[infoRecordatorios.data.length] = array;
      localStorage.setItem("rp_data_recordatorios",JSON.stringify(infoRecordatorios));
      break;
    case 'demostracion':
      infoDemostraciones.data[infoDemostraciones.data.length] = array;
      localStorage.setItem("rp_data_demostraciones",JSON.stringify(infoDemostraciones));
      break;

  }


}
/*funcion agregar recordatorio*/
/*FUNCION EDITAR UN RECORDATORIO********/
function scheduleEdit(id,title,message,schedule_time){
  cordova.plugins.notification.local.schedule({
    id: id,
    title: title,
    message: message,
    foreground: true,
    at: schedule_time,
    text: message
});

var array = [id,title,message,schedule_time];

var evento = localStorage.getItem("evento");
switch (evento) {
  case 'citas':
    infoCitas.data[infoCitas.data.length] = array;
    localStorage.setItem("rp_data_citas",JSON.stringify(infoCitas));

    break;
  case 'llamada':
    infoLlamadas.data[infoLlamadas.data.length] = array;
    localStorage.setItem("rp_data_llamadas",JSON.stringify(infoLlamadas));

    break;
  case 'visitas':
    infoVisitas.data[infoVisitas.data.length] = array;
    localStorage.setItem("rp_data_visitas",JSON.stringify(infoVisitas));
      alert(JSON.stringify(infoVisitas));
    break;
  case 'recordatorios':
    infoRecordatorios.data[infoRecordatorios.data.length] = array;
    localStorage.setItem("rp_data_recordatorios",JSON.stringify(infoRecordatorios));
    break;
  case 'demostraciones':
    infoDemostraciones.data[infoDemostraciones.data.length] = array;
    localStorage.setItem("rp_data_demostraciones",JSON.stringify(infoDemostraciones));
    break;

}


}
/*FUNCION EDITAR UN RECORDATORIO******/
