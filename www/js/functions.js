/**
 * DESARROLLADOR @MARCO ANTONIO LÓPEZ PEREZ
 */

function editarEvento(valor){

      let id = valor.id;
      var identificador = $("#"+id+"").attr("identificador");
      navigator.notification.alert(identificador);

}

/*******************************/
function eliminarEvento(valor){
      let id = valor.id;
      var identificador = $("#"+id+"").attr("identificador");
      navigator.notification.alert(identificador);
}
  /***********INICIA SECCION DE CREAR RECORDATORIO**************/
  var info = null;
  document.addEventListener("deviceready",function(){
    if (!localStorage.getItem("rp_data")) {
      var rp_data = {data:[]};
      localStorage.setItem("rp_data",JSON.stringify(rp_data));

    }

    info = JSON.parse(localStorage.getItem("rp_data"));

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

    var date = $("#date").val();
    var time = $("#time").val();
    var title = $("#title").val();
    var message =  $("#message").val();

    if (date == "" || time == "" || title == "" || message == "") {
      navigator.notification.alert("Porfavor ingrese todos los campos requeridos");

      return;
    }

    var schedule_time =  new Date((date + " " + time).replace(/-/g,"/")).getTime();
    schedule_time = new Date(schedule_time);

    var id = info.data.length;

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
      at: schedule_time,
      text: message
      /*
      actions: [
      { id: 'yes', title: 'Yes' },
      { id: 'no',  title: 'No' }
    ]
    */
  });

  var array = [id,title,message,schedule_time];
  info.data[info.data.length] = array;

  localStorage.setItem("rp_data",JSON.stringify(info));

  navigator.notification.alert("Recordatorio agregado exitosamente");
}
/*funcion agregar recordatorio*/
/*funcion visualizar todos los recordatorios*/
$(document).on("pagebeforeshow","#all",function(){
  var html = '';

  for (var count = 0; count < info.data.length; count++) {

    html = html + "<tr><td>" + info.data[count][0] + "</td><td>" + info.data[count][1] + "</td><td>" + info.data[count][2] + "</td><td>" + "<button class='botonesEditar' id='"+info.data[count][0]+"' identificador='"+info.data[count][0]+"' onclick='editarEvento(this)'><i class='fas fa-edit'></i></button>" + "<button class='botonesEliminar' id='"+info.data[count][0]+"' identificador='"+info.data[count][0]+"' onclick='eliminarEvento(this)'><i class='fas fa-trash-alt'></i></button>" + "</td></tr>";
  }

  $("table#allTable tbody").empty();
  $("table#allTable tbody").append(html).closest("#table#allTable").table("refresh").trigger("create");
})
/*funcion visualizar todos los recordatorios*/
/*funcion visualizar los recordatorios pendientes*/
$(document).on("pagebeforeshow","#pending",function(){

  var html = '';
  for (var count = 0; count < info.data.length; count++) {

    var schedule_time = new Date(info.data[count][3]).getTime();
    var current_time = new Date().getTime();

    if (current_time < schedule_time) {
      html = html + "<tr><td>" + info.data[count][1] + "</td><td>" + info.data[count][3] + "</td></tr>";
    }
  }

  $("table#pendingTable tbody").empty();
  $("table#pendingTable tbody").append(html).closest("table#pendingTable").table("refresh").trigger("create");
});
/*funcion visualizar los recordatorios pendientes*/
