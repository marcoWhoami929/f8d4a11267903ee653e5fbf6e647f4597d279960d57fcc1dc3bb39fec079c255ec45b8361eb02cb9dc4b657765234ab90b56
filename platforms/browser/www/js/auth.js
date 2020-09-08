$(document).ready(function() {
  //var url = "https://sanfranciscodekkerlab.com/matriz/auth.php?callback=?";
  //var url = "http://192.168.1.245/blitz/authenticador.php?callback=?";
  var url = "https://sanfranciscodekkerlab.com/crm/authenticador.php?callback=?";

  //Login Function
  $("#login").click(function() {
    var email = $("#email").val();
    var password = $("#password").val();
    var dataString = "email=" + email + "&password=" + password + "&login=";

    if ($.trim(email).length > 0 & $.trim(password).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function() {
          $("#login").html('Conectando...');
        },
        success: function(data) {
          if (data != "fail") {
            localStorage.login = "true";
            var json = data;
            for (var clave in json) {
              localStorage.idUsuario = JSON.parse(json).idUsuario;
              localStorage.nombre = JSON.parse(json).nombre;
              localStorage.area = JSON.parse(json).area;

            }

            swal({
              title: "CRM",
              text: "Bienvenido",
              icon: "info",
              button: true,
              dangerMode: false,
            })
            .then((willDelete) => {
              if (willDelete) {
                var acceso = 1;
                var dataString = "acceso=" + acceso + "&cargarSlider=";

                $.ajax({
                  type: "POST",
                  url: url,
                  data: dataString,
                  crossDomain: true,
                  cache: false,
                  success: function(data) {
                    if (data != "failed") {
                      localStorage.sliderData = data;
                        window.location.href = "inicio.html";
                    } else if (data == "failed") {

                    }
                  }
                })

              }
            });

          } else if (data == "fail") {
            swal("Algo Salio Mal", "verifique su correo o contraseña", "error");
            //alert("Error verifique su correo o contraseña");
            $("#login").html('Acceder');
          }
        }
      });
    } else {
      swal("Llenar Todos los Campos...", "", "info");
    }
    return false;
  });
  /***********MOSTRAR PROSPECTOS***************/
  $(".btnProspectos").click(function() {

    var idAgente = localStorage.idUsuario;
    var dataString = "idAgente=" + idAgente + "&listaGeneralProspectos=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      success: function(data) {
        if (data != "failed") {
          localStorage.listaGeneralProspectos = data;

        }
      }
    })
    var dataString = "idAgente=" + idAgente + "&listarProspectos=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.arregloProspectos = data;
              window.location.href = "prospectos.html";
          } else if (data == "failed") {
            swal("Upss", "No hay prospectos actualmente.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********MOSTRAR PROSPECTOS****************/
  /************BUSCADOR DE PROSPECTOS************/
  $("#buscadorProspectos").keypress(function(e) {
    if (e.which == 13) {
      return false;
    }
  });
  $('#datosBusqueda').on('keyup', function (e) {
    var nodos = document.getElementById('contenedorProspectos');
    while (nodos.firstChild) {
      nodos.removeChild(nodos.firstChild);
    }
    e.preventDefault(); // se previene la acción por defecto
    var search =  $("#datosBusqueda").val();
    localStorage.setItem("busqueda", search);
    var busqueda = localStorage.getItem("busqueda");
    var idAgente = localStorage.getItem("idUsuario");
    var dataString = "search=" + busqueda + "&idAgente=" + idAgente + "&listarResultadosBusqueda=";

    if ($.trim(busqueda).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function() {
          var nodos = document.getElementById('contenedorProspectos');
          while (nodos.firstChild) {
            nodos.removeChild(nodos.firstChild);
          }
        },
        success: function(data) {

          if (data != "failed") {
            var json = data;
            var types = JSON.parse(json);
            $("#contenedorProspectos").html("");
            for (x = 0; x < types.length; x++) {

              if (types[x]["habilitado"] == 1) {

                var agentes = [
                  {"id":2,"agente":"Orlando Briones"},
                  {"id":3,"agente":"Gerónimo Bautista"},
                  {"id":4,"agente":"Jonathan González Sánchez"},
                  {"id":5,"agente":"San Manuel"},
                  {"id":6,"agente":"Reforma"},
                  {"id":7,"agente":"Capu"},
                  {"id":8,"agente":"Santiago"},
                  {"id":9,"agente":"Las Torres"}];

                Array.prototype.findBy = function(column,value){
                  for (var i = 0; i < this.length; i++) {
                    var object = this[i];
                    if (column in object && object[column]=== value) {
                      return object["agente"];
                    }
                  }
                  return null;
                }
                var agente = types[x]["idAgente"]*1;
                var agenteVenta = agentes.findBy('id', agente);

                var filaProspecto = `<a class="detalleProspecto" idProspecto="`+types[x]["id"]+`"><div class="filaGeneral">
                <div>
                <i class="fas fa-user-circle fa-3x iconos-contenedor"></i>
                </div>
                <div class="nombreProspecto">
                <h4>`+types[x]["nombreCompleto"]+`</h4>
                </div>
                <div class="tallerProspecto">
                <h5><i class="fas fa-map-marked-alt fa-1x iconos"></i> `+types[x]["taller"]+`</h5>
                  <h5 class="textAgente"> `+agenteVenta+`</h5>
                </div>

                </div></a>`;
              }else{

                var agentes = [
                  {"id":2,"agente":"Orlando Briones"},
                  {"id":3,"agente":"Gerónimo Bautista"},
                  {"id":4,"agente":"Jonathan González Sánchez"},
                  {"id":5,"agente":"San Manuel"},
                  {"id":6,"agente":"Reforma"},
                  {"id":7,"agente":"Capu"},
                  {"id":8,"agente":"Santiago"},
                  {"id":9,"agente":"Las Torres"}];

                Array.prototype.findBy = function(column,value){
                  for (var i = 0; i < this.length; i++) {
                    var object = this[i];
                    if (column in object && object[column]=== value) {
                      return object["agente"];
                    }
                  }
                  return null;
                }
                var agente = types[x]["idAgente"]*1;
                var agenteVenta = agentes.findBy('id', agente);

                var filaProspecto = `<div class="filaGeneral">
                <div>
                <i class="fas fa-user-circle fa-3x iconos-contenedor"></i>
                </div>
                <div class="nombreProspecto">
                <h4>`+types[x]["nombreCompleto"]+`</h4>
                </div>
                <div class="tallerProspecto">
                <h5><i class="fas fa-map-marked-alt fa-1x iconos"></i> `+types[x]["taller"]+`</h5>
                  <h5 class="textAgente"> `+agenteVenta+`</h5>
                </div>

                </div>`;
              }

              $("#contenedorProspectos").append(filaProspecto);

            }

          } else if (data == "failed") {

          }
        }
      })
    } else {
      var nodos = document.getElementById('contenedorProspectos');
      while (nodos.firstChild) {
        nodos.removeChild(nodos.firstChild);
      }
      var json = localStorage.arregloProspectos;
      var types = JSON.parse(json);

      $("#contenedorProspectos").html("");

      for (x = 0; x < types.length; x++) {
        if (types[x]["habilitado"] == 1) {
          var agentes = [
            {"id":2,"agente":"Orlando Briones"},
            {"id":3,"agente":"Gerónimo Bautista"},
            {"id":4,"agente":"Jonathan González Sánchez"},
            {"id":5,"agente":"San Manuel"},
            {"id":6,"agente":"Reforma"},
            {"id":7,"agente":"Capu"},
            {"id":8,"agente":"Santiago"},
            {"id":9,"agente":"Las Torres"}];

          Array.prototype.findBy = function(column,value){
            for (var i = 0; i < this.length; i++) {
              var object = this[i];
              if (column in object && object[column]=== value) {
                return object["agente"];
              }
            }
            return null;
          }
          var agente = types[x]["idAgente"]*1;
          var agenteVenta = agentes.findBy('id', agente);

          var filaProspecto = `<a class="detalleProspecto" idProspecto="`+types[x]["id"]+`"><div class="filaGeneral">
          <div>
          <i class="fas fa-user-circle fa-3x iconos-contenedor"></i>
          </div>
          <div class="nombreProspecto">
          <h4>`+types[x]["nombreCompleto"]+`</h4>
          </div>
          <div class="tallerProspecto">
          <h5><i class="fas fa-map-marked-alt fa-1x iconos"></i> `+types[x]["taller"]+`</h5>
            <h5 class="textAgente"> `+agenteVenta+`</h5>
          </div>

          </div></a>`;
        }else{
          var agentes = [
            {"id":2,"agente":"Orlando Briones"},
            {"id":3,"agente":"Gerónimo Bautista"},
            {"id":4,"agente":"Jonathan González Sánchez"},
            {"id":5,"agente":"San Manuel"},
            {"id":6,"agente":"Reforma"},
            {"id":7,"agente":"Capu"},
            {"id":8,"agente":"Santiago"},
            {"id":9,"agente":"Las Torres"}];

          Array.prototype.findBy = function(column,value){
            for (var i = 0; i < this.length; i++) {
              var object = this[i];
              if (column in object && object[column]=== value) {
                return object["agente"];
              }
            }
            return null;
          }
          var agente = types[x]["idAgente"]*1;
          var agenteVenta = agentes.findBy('id', agente);

          var filaProspecto = `<div class="filaGeneral">
          <div>
          <i class="fas fa-user-circle fa-3x iconos-contenedor"></i>
          </div>
          <div class="nombreProspecto">
          <h4>`+types[x]["nombreCompleto"]+`</h4>
          </div>
          <div class="tallerProspecto">
          <h5><i class="fas fa-map-marked-alt fa-1x iconos"></i> `+types[x]["taller"]+`</h5>
            <h5 class="textAgente"> `+agenteVenta+`</h5>
          </div>

          </div>`;
        }

        $("#contenedorProspectos").append(filaProspecto);
      }
    }
    return false;
  });
  /***********BUSCADOR DE PROSPECTOS************/
  /***********DETALLE PROSPECTO***************/
  $('body').on('click', '#contenedorProspectos a', function(){

    var idProspecto = $(this).attr('idProspecto');
    localStorage.setItem("idProspecto",idProspecto);
    var dataString = "idProspecto=" + idProspecto + "&listaTitulosProspectos=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      beforeSend: function() {

      },
      success: function(data) {
        if (data != "failed") {
          localStorage.listaTitulosProspectos = data;
        }
      }
    });
    var dataString = "idProspecto=" + idProspecto + "&listaFaseProspectos=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      beforeSend: function() {

      },
      success: function(data) {
        if (data != "failed") {

          localStorage.listaFaseProspectos = data;
        }
      }
    });
    var dataString = "idProspecto=" + idProspecto + "&listaOrigenProspectos=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      beforeSend: function() {

      },
      success: function(data) {
        if (data != "failed") {

          localStorage.listaOrigenProspectos = data;
        }
      }
    });

    var dataString = "idProspecto=" + idProspecto + "&detalleProspecto=";
    if ($.trim(idProspecto).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function() {

        },
        success: function(data) {
          if (data != "failed") {
            localStorage.detalleProspecto = data;
            window.location.href = "edicionProspecto.html";
          } else if (data == "failed") {
            swal("Upss", "Tenemos problemas para obtener los datos del prospecto comunicate con el administrador.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;
  });

  /**********DETALLE PROSPECTO*****************/
  /*********UBICACION PROSPECTO**********/
  $("#verUbicacionPerfil").click(function(){
    var latitud = $(this).attr("latitud");
    var longitud = $(this).attr("longitud");
    localStorage.setItem("latitudProspecto",latitud);
    localStorage.setItem("longitudProspecto",longitud);
    window.location.href = "detalleUbicacion.html";
  });
  /*********UBICACION PROSPECTO**********/
  /*********EDICION  PROSPECTO**********/
  $("#editarProspecto").click(function(){

    var idProspecto = localStorage.getItem("idProspecto");
    var idAgente = localStorage.getItem("idUsuario");
    var nombrePerfil = $("#nombrePerfil").val();
    var correoPerfil = $("#correoPerfil").val();
    var tallerPerfil = $("#tallerPerfil").val();
    var telefonoPerfil = $("#telefonoPerfil").val();
    var celularPerfil = $("#celularPerfil").val();
    var direccionPerfil = $("#direccionPerfil").val();
    var coordenadasPerfil = $("#coordenadasPerfil").val();
    var coord = coordenadasPerfil.split(',');
    var latitud = coord[0];
    var longitud = coord[1];
    var tituloProspectoPerfil = $("#tituloProspectoPerfil").val();
    var faseProspectoPerfil = $("#faseProspectoPerfil").val();
    var origenProspectoPerfil = $("#origenProspectoPerfil").val();
    var comentariosPerfil = $("#comentariosPerfil").val();

    var dataString = "idProspecto=" + idProspecto + "&nombrePerfil=" + nombrePerfil + "&correoPerfil=" + correoPerfil + "&tallerPerfil=" + tallerPerfil + "&telefonoPerfil=" + telefonoPerfil + "&celularPerfil=" + celularPerfil + "&direccionPerfil=" + direccionPerfil + "&latitud=" + latitud + "&longitud=" + longitud + "&tituloProspectoPerfil=" + tituloProspectoPerfil + "&faseProspectoPerfil=" + faseProspectoPerfil + "&origenProspectoPerfil=" + origenProspectoPerfil + "&comentariosPerfil=" + comentariosPerfil + "&idAgente=" + idAgente + "&editarProspecto=";
    if ($.trim(idProspecto).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function() {

        },
        success: function(data) {


          if (data != "failed") {

            var idAgente = localStorage.idUsuario;
            var dataString = "idAgente=" + idAgente + "&listarProspectos=";
              $.ajax({
                type: "POST",
                url: url,
                data: dataString,
                crossDomain: true,
                cache: false,
                beforeSend: function() {

                },
                success: function(data) {
                  if (data != "failed") {
                    localStorage.arregloProspectos = data;
                  } else if (data == "failed") {
                    swal("Upss", "No hay prospectos actualmente.", "info");

                  }
                }
              })
            /********ACTUALIZAR DETALLE DE PROSPECTO********/
            var idProspecto = localStorage.getItem("idProspecto");
            var dataString = "idProspecto=" + idProspecto + "&detalleProspecto=";
            $.ajax({
              type: "POST",
              url: url,
              data: dataString,
              crossDomain: true,
              cache: false,
              success: function(data) {
                if (data != "failed") {
                  localStorage.detalleProspecto = data;

                } else if (data == "failed") {
                  swal("Upss", "Tenemos problemas para obtener los datos del prospecto comunicate con el administrador.", "info");

                }
              }
            })
              /********ACTUALIZAR DETALLE DE PROSPECTO********/
            swal({
              title: "Prospecto Actualizado",
              text: "",
              icon: "success",
              button: true,
              dangerMode: false,
            })
            .then((willDelete) => {
              if (willDelete) {
                  window.location.href = "edicionProspecto.html";
              }
            });

          } else if (data == "failed") {
            alert("No Hay Conexion...");
          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /*********EDICION PROSPECTO**********/
  /***********MOSTRAR OPORTUNIDADES***************/
  $(".btnOportunidades").click(function() {

    var idAgente = localStorage.idUsuario;
    var dataString = "idAgente=" + idAgente + "&listarOportunidades=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function() {

        },
        success: function(data) {
          if (data != "failed") {
            localStorage.arregloOportunidades = data;
            window.location.href = "oportunidades.html";
          } else if (data == "failed") {
            swal("Upss", "No hay oportunidades actualmente.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********MOSTRAR OPORTUNIDADES****************/
  /**********NUEVAS ACCIONES ******************/
  $("#nuevaAccionProspecto").click(function(){

        var idProspecto = localStorage.getItem("idProspecto");
        var dataString = "idProspecto=" + idProspecto + "&buscarSeguimientosProspecto=";
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
                var seguimientos = data;
                localStorage.seguimientos = seguimientos.replace(/['"]+/g, '');
                window.location.href = "acciones.html";
            } else if (data == "failed") {


            }
          }
        })

  });
  /*********NUEVAS ACCIONES*******************/
  /**********REASIGNAR PROSPECTO ******************/
  $("#btnReasignarProspecto").click(function(){
    window.location.href = "reasignacion.html";
  });
  $("#reasignarProspecto").click(function(){
      var idAgente = localStorage.getItem("idUsuario");
      var nombreAgente = localStorage.getItem("nombre");
      var idProspecto = localStorage.getItem("idProspecto");
      var nombreProspecto = $("#nombreProspectoReasignado").val();
      var nuevoAgenteAsignado = $("#agenteVentaAsignado").val();
      var nombreAgenteAsignado = $("#agenteAsignado").val();
      var comentariosAsignacion = $("#comentariosAsignacion").val();

      var dataString = "idAgente=" + idAgente + "&nombreAgente=" + nombreAgente + "&idProspecto=" + idProspecto + "&nombreProspecto=" + nombreProspecto + "&nuevoAgenteAsignado=" + nuevoAgenteAsignado + "&nombreAgenteAsignado=" + nombreAgenteAsignado + "&comentariosAsignacion=" + comentariosAsignacion + "&reasignarAgente=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          beforeSend: function() {

          },
          success: function(data) {
            if (data != "failed") {

                swal({
                  title: "El prospecto ha sido reasignado exitosamente!",
                  text: "",
                  icon: "success",
                  button: true,
                  dangerMode: false,
                })
                .then((willDelete) => {
                  if (willDelete) {
                      window.location.href = "inicio.html";
                  }
                });
            } else if (data == "failed") {
              swal("Upss", "No hay oportunidades actualmente.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;



  })
  /********* REASIGNAR PROSPECTO *******************/
  /**********CREAR OPORTUNIDAD*********************/
  $('.btnCrearOportunidad').click( function(){
    var idProspecto = localStorage.getItem("idProspecto");
    var dataString = "idProspecto=" + idProspecto + "&listarFaseOportunidades=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      success: function(data) {
        if (data != "failed") {

          localStorage.listarFaseOportunidades = data;

        }
      }
    });
    var dataString = "idProspecto=" + idProspecto + "&listarCertezas=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      success: function(data) {
        if (data != "failed") {
          localStorage.listarCertezas = data;
            window.location.href = "crearOportunidad.html";
        }
      }
    });


  });
  /*********MOSTRAR OPORTUNIDADES*********************/
  /**********CREAR OPORTUNIDAD****************/
  $("#btnGenerarOportunidad").click(function() {

    var idAgente = localStorage.idUsuario;
    if (localStorage.idProspecto == null) {
        var id = localStorage.idOportunidad;
    }else{
        var id = localStorage.idProspecto;
    }
    var idProspecto = id;
    var conceptoOportunidad = $("#conceptoOportunidad").val();
    var faseOportunidad = $("#faseOportunidad").val();
    var montoOportunidad = $("#montoOportunidad").val();
    var cierreEstimado = $("#cierreEstimado").val();
    var certezaOportunidad = $("#certezaOportunidad").val();
    var productosOportunidad = $("#productosOportunidad").val();
    var codigosOportunidad = $("#codigosOportunidad").val();
    var cantidadesOportunidad = $("#cantidadesOportunidad").val();
    var preciosOportunidad = $("#preciosOportunidad").val();
    var comentariosOportunidad = $("#comentariosOportunidad").val();


    var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&conceptoOportunidad=" + conceptoOportunidad + "&faseOportunidad=" + faseOportunidad + "&montoOportunidad=" + montoOportunidad + "&cierreEstimado=" + cierreEstimado + "&certezaOportunidad=" + certezaOportunidad + "&comentariosOportunidad=" + comentariosOportunidad + "&productosOportunidad=" + productosOportunidad + "&codigosOportunidad=" + codigosOportunidad + "&cantidadesOportunidad=" + cantidadesOportunidad + "&preciosOportunidad=" + preciosOportunidad + "&generarOportunidad=";

    if ($.trim(idAgente).length > 0 && $.trim(cierreEstimado).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {

            swal({
              title: "Nueva Oportunidad de Venta Creada Exitosamente!",
              text: "",
              icon: "success",
              button: true,
              dangerMode: false,
            })
            .then((willDelete) => {
              if (willDelete) {
                var dataString = "idOportunidad=" + idProspecto + "&listarOportunidadesVenta=";
                $.ajax({
                  type: "POST",
                  url: url,
                  data: dataString,
                  crossDomain: true,
                  cache: false,
                  success: function(data) {
                    if (data != "failed") {
                      localStorage.oportunidadesVenta = data;
                      window.location.href = "inicio.html";
                    } else if (data == "failed") {
                      swal("Upss", "No hay oportunidades creadas.", "info");

                    }
                  }
                })

              }
            });

          } else if (data == "failed") {
            swal("Upss", "No pudimos procesar la oportunidad de venta.", "info");

          }
        }
      })
    } else {
      swal("Debe de llenar todos los campos requeridos", "", "error");
    }
    return false;

  });
  /**********GENERAR NUEVA OPORTUNIDAD****************/
  /***********MOSTRAR CLIENTES***************/
  $(".btnClientes").click(function() {

    var idAgente = localStorage.idUsuario;
    var dataString = "idAgente=" + idAgente + "&listarClientes=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function() {

        },
        success: function(data) {
          if (data != "failed") {
            localStorage.arregloClientes = data;
            window.location.href = "clientes.html";
          } else if (data == "failed") {
            swal("Upss", "No hay clientes actualmente.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********MOSTRAR CLIENTES****************/
  /***********ACCIONES OPORTUNIDADES***************/
  $('body').on('click', '#contenedorOportunidades a', function(){

    var idOportunidad = $(this).attr('idOportunidad');
    localStorage.setItem("idOportunidad",idOportunidad);
    localStorage.setItem("sesionOportunidades","true");
    window.location.href = "acciones.html";

  });
  $(".btnConvertirVenta").click(function(){
    var idOportunidad = localStorage.idOportunidad;
    var dataString = "idOportunidad=" + idOportunidad + "&listarOportunidadesVenta=";

    if ($.trim(idOportunidad).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.oportunidadesVenta = data;
            window.location.href = "oportunidadesVenta.html";
          } else if (data == "failed") {
            swal("Upss", "No hay oportunidades creadas.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;
  });
  $('body').on('click', '#contenedorOportunidadesVenta a', function(){

    var idOportunidadVenta = $(this).attr('idOportunidadVenta');
    var dataString = "idOportunidadVenta=" + idOportunidadVenta + "&obtenerDatosOportunidad=";

    if ($.trim(idOportunidadVenta).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.datosOportunidadVenta = data;
            window.location.href = "convertirVenta.html";
          } else if (data == "failed") {
            swal("Upss", "No pudimos obtener los datos de la oportunidad.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;
  });
  /**********GENERAR VENTA****************/
  $("#btnCerrarVenta").click(function() {

    var idAgente = localStorage.idUsuario;
    if (localStorage.idOportunidad == null) {
        var id = localStorage.idCliente;
    }else{
        var id = localStorage.idOportunidad;
    }
    var idOportunidad = id;
    var idOportunidadVenta = $("#idOportunidadVenta").val();
    var conceptoVenta = $("#conceptoVenta").val();
    var fechaVenta = $("#fechaVenta").val();
    var montoVenta = $("#montoVenta").val();
    var comisionVenta = $("#comisionVenta").val();
    var serieVenta = $("#serieVenta").val();
    var folioVenta = $("#folioVenta").val();
    var observacionesVenta = $("#observacionesVenta").val();


    var dataString = "idAgente=" + idAgente + "&idOportunidad=" + idOportunidad + "&idOportunidadVenta=" + idOportunidadVenta + "&conceptoVenta=" + conceptoVenta + "&fechaVenta=" + fechaVenta + "&montoVenta=" + montoVenta + "&comisionVenta=" + comisionVenta + "&serieVenta=" + serieVenta + "&folioVenta=" + folioVenta + "&observacionesVenta=" + observacionesVenta + "&cerrarVenta=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {

            swal({
              title: "Nueva Venta Creada Exitosamente!",
              text: "",
              icon: "success",
              button: true,
              dangerMode: false,
            })
            .then((willDelete) => {
              if (willDelete) {
                var dataString = "idOportunidad=" + idOportunidad + "&listarOportunidadesVenta=";
                $.ajax({
                  type: "POST",
                  url: url,
                  data: dataString,
                  crossDomain: true,
                  cache: false,
                  success: function(data) {
                    if (data != "failed") {
                      localStorage.oportunidadesVenta = data;
                      window.location.href = "acciones.html";
                    } else if (data == "failed") {
                      swal("Upss", "No hay oportunidades creadas.", "info");
                      window.location.href = "inicio.html";
                    }
                  }
                })

              }
            });

          } else if (data == "failed") {
            swal("Upss", "No pudimos procesar venta.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********GENERAR VENTA****************/
    $('body').on('click', '#contenedorClientes a', function(){
      var idProspecto = $(this).attr('idCliente');
      localStorage.setItem("idOportunidad",idProspecto);
      localStorage.setItem("sesionOportunidades","true");
      window.location.href = "acciones.html";
    })
  $("#btnMostrarVentasRealizadas").click(function(){
    var idAgente = localStorage.getItem("idUsuario");
    var dataString = "idAgente=" + idAgente + "&ventasRealizadas=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      success: function(data) {
        if (data != "failed") {

              localStorage.ventasRealizadas = data;
              window.location.href ="ventas.html";

        } else if (data == "failed") {

              swal("Upss", "No hay Ventas Concretadas.", "info");

        }
      }
    })

  });
  /********MOSTRAR SEGUIMIENTOS******/
  $('body').on('click', '#contenedorSeguimientos a', function(){
    var idProspecto = $(this).attr('idProspecto');
    localStorage.setItem("idProspecto",idProspecto);

    var dataString = "idProspecto=" + idProspecto + "&detalleSeguimientos=";

    if ($.trim(idProspecto).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.detalleSeguimientos = data;
            window.location.href = "detalleSeguimientos.html";
          } else if (data == "failed") {
            swal("Upss", "No pudimos obtener seguimientos del prospecto indicado.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  })
  /********MOSTRAR SEGUIMIENTOS*****/
  $('body').on('click', '#accionRecordatorios a', function(){
    var accion = $(this).attr('accion');
    localStorage.setItem("accion",accion);
    window.location.href = "listaAcciones.html";
  })
  $('body').on('click', '#contenedorContactos a', function(){
    var idProspecto = $(this).attr('idProspecto');
    localStorage.setItem("idProspecto",idProspecto);

    var dataString = "idProspecto=" + idProspecto + "&datosProspectoDetalle=";
    $.ajax({
      type: "POST",
      url: url,
      data: dataString,
      crossDomain: true,
      cache: false,
      success: function(data) {
        if (data != "failed") {

              localStorage.datosProspecto = data;
              var accion = localStorage.getItem("accion");
              switch (accion) {
                case "cita":
                  window.location.href = "cita.html";
                  break;
                case "llamada":
                  window.location.href = "llamada.html";
                  break;
                case "visita":
                  window.location.href = "visita.html";
                  break;
                case "recordatorio":
                  window.location.href = "recordatorio.html";
                  break;
                case "demostracion":
                 window.location.href = "demostracion.html";
                  break;
              }

        } else if (data == "failed") {


        }
      }
    })
  })
  /**********CREAR NUEVA LLAMADA************/
  $("#nuevaLlamada").click(function(){

      var idProspecto = localStorage.getItem("idProspecto");
      var nombreProspecto = $("#nombreProspectoRecordatorio").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorio").val();
      var fecha = $("#fechaRecordatorio").val();
      var hora = $("#horaRecordatorio").val();
      var descripcion = $("#descripcionRecordatorio").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&agendarNuevaLlamada=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Nueva Llamada Agendada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                  window.location.href = "nuevasAcciones.html";
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo guardar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;



  })
  /**********CREAR NUEVA LLAMADA************/
  /**********CREAR NUEVA CITA************/
  $("#nuevaCita").click(function(){

      var idProspecto = localStorage.getItem("idProspecto");
      var nombreProspecto = $("#nombreProspectoRecordatorio").val();
      var lugar = $("#lugarRecordatorio").val();
      var lat = $("#latRecordatorio").val();
      var long = $("#longRecordatorio").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorio").val();
      var fecha = $("#fechaRecordatorio").val();
      var hora = $("#horaRecordatorio").val();
      var descripcion = $("#descripcionRecordatorio").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&lugar=" + lugar + "&lat=" + lat + "&long=" + long + "&agendarNuevaCita=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Nueva Cita Agendada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                  window.location.href = "nuevasAcciones.html";
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo guardar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;



  })
  /**********CREAR NUEVA CITA************/
  /**********CREAR NUEVA VISITA************/
  $("#nuevaVisita").click(function(){

      var idProspecto = localStorage.getItem("idProspecto");
      var nombreProspecto = $("#nombreProspectoRecordatorio").val();
      var lugar = $("#lugarRecordatorio").val();
      var lat = $("#latRecordatorio").val();
      var long = $("#longRecordatorio").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorio").val();
      var fecha = $("#fechaRecordatorio").val();
      var hora = $("#horaRecordatorio").val();
      var descripcion = $("#descripcionRecordatorio").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&lugar=" + lugar + "&lat=" + lat + "&long=" + long + "&agendarNuevaVisita=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Nueva Visita Agendada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                  window.location.href = "nuevasAcciones.html";
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo guardar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;



  })
  /**********CREAR NUEVA VISITA************/
  /**********CREAR NUEVO RECORDATORIO************/
  $("#nuevoRecordatorio").click(function(){

      var idProspecto = localStorage.getItem("idProspecto");
      var nombreProspecto = $("#nombreProspectoRecordatorio").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorio").val();
      var fecha = $("#fechaRecordatorio").val();
      var hora = $("#horaRecordatorio").val();
      var descripcion = $("#descripcionRecordatorio").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&agendarNuevoRecordatorio=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Nuevo Recordatorio Agendado Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                  window.location.href = "nuevasAcciones.html";
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo guardar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;



  })
  /**********CREAR NUEVO RECORDATORIO************/
  /**********CREAR NUEVA DEMOSTRACION************/
  $("#nuevaDemostracion").click(function(){

      var idProspecto = localStorage.getItem("idProspecto");
      var nombreProspecto = $("#nombreProspectoRecordatorio").val();
      var lugar = $("#lugarRecordatorio").val();
      var lat = $("#latRecordatorio").val();
      var long = $("#longRecordatorio").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorio").val();
      var fecha = $("#fechaRecordatorio").val();
      var hora = $("#horaRecordatorio").val();
      var descripcion = $("#descripcionRecordatorio").val();
      var productos = $("#productos").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&lugar=" + lugar + "&lat=" + lat + "&long=" + long + "&productos=" + productos + "&agendarNuevaDemostracion=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Nueva Demostracion Agendada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {

                  window.location.href = "nuevasAcciones.html";
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo guardar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;



  })
  /**********CREAR NUEVA DEMOSTRACION************/
  /**********DESCARTAR PROSPECTO************/
  $("#descartarProspecto").click(function(){
      var idAgente = localStorage.getItem("idUsuario");
      var nombreAgente = localStorage.getItem("nombre");
      var idProspecto = localStorage.getItem("idProspecto");
      var nombreDescartado = $("#nombreDescartado").val();
      var motivoDescartado = $("#motivoDescartado").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&nombreAgente=" + nombreAgente + "&nombreDescartado=" + nombreDescartado + "&motivoDescartado=" + motivoDescartado + "&descartarProspecto=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {

                swal({
                  title: "Se ha descartado exitosamente!",
                  text: "",
                  icon: "success",
                  button: true,
                  dangerMode: false,
                })
                .then((willDelete) => {
                  if (willDelete) {
                      window.location.href = "inicio.html";
                  }
                });
            } else if (data == "failed") {
              swal("Upss", "No se pudo descartar.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;



  })
  /********* DESCARTAR PROSPECTO *******************/
  /**********ACCIONES OPORTUNIDADES*****************/
  /***********MOSTRAR CALENDARIO***************/
  $(".btnCalendario").click(function() {

    var idAgente = localStorage.idUsuario;
    localStorage.setItem("pendientes","false");
    var fecha = $("#fechaEvento").attr("class");
    if (typeof fecha == 'undefined') {

      var fechaEvento = "";

    }else{

      var fechaEvento = $("#fechaEvento").val();
    }

    var dataString = "idAgente=" + idAgente + "&fechaEvento=" + fechaEvento + "&listarCalendario=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.miCalendario = data;
            window.location.href = "calendario.html";
          } else if (data == "failed") {
            //swal("Upss", "No hay eventos creados.", "info");
            var calendario = '[]';
            localStorage.miCalendario = calendario;
            window.location.href = "calendario.html";


          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********MOSTRAR CALENDARIO****************/
  /**********MOSTRAR DETALLES EVENTO**************/
    $('body').on('click', '.events-wrapper a', function(){
      var idEvento = $(this).attr("idEvento");
      var evento = $(this).attr("evento");
      localStorage.setItem("evento",evento);
      localStorage.setItem("idEvento",idEvento);

      var dataString = "idEvento=" + idEvento + "&evento=" + evento + "&detalleEvento=";

      if ($.trim(idEvento).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              localStorage.detalleEvento = data;
              switch (evento) {
                case 'citas':
                  window.location.href = "detalleCita.html";
                  break;
                case 'llamada':
                  window.location.href = "detalleLlamada.html";
                  break;
                case 'visitas':
                  window.location.href = "detalleVisita.html";
                  break;
                case 'recordatorios':
                  window.location.href = "detalleRecordatorios.html";
                  break;
                case 'demostraciones':
                  window.location.href = "detalleDemostraciones.html";
                  break;

              }

            } else if (data == "failed") {
              swal("Upss", "No se pudieron obtener los detalles del evento.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

    });
  /*********MOSTRAR DETALLES EVENTO**************/
  /**********EDITAR VISITA************/
  $("#editarVisita").click(function(){
      var idEvento = $("#idEventoRecordatorio").val();
      var idProspecto = $("#idProspectoEdicion").val();
      var nombreProspecto = $("#nombreProspectoRecordatorioEdicion").val();
      var lugar = $("#lugarRecordatorioEdicion").val();
      var lat = $("#latRecordatorioEdicion").val();
      var long = $("#longRecordatorioEdicion").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorioEdicion").val();
      var fecha = $("#fechaRecordatorioEdicion").val();
      var hora = $("#horaRecordatorioEdicion").val();
      var descripcion = $("#descripcionRecordatorioEdicion").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&idEvento=" + idEvento + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&lugar=" + lugar + "&lat=" + lat + "&long=" + long + "&editarVisita=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Visita Actualizada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {
                  var idAgente = localStorage.idUsuario;
                  if (localStorage.pendientes == "true") {
                    var dataString = "idAgente=" + idAgente + "&listarPendientes=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.misPendientes = data;
                          window.location.href = "pendientes.html";
                        } else if (data == "failed") {
                          swal("Upss", "No hay eventos pendientes por finalizar.", "info");

                        }
                      }
                    })

                  }else{

                    var fecha = $("#fechaEvento").attr("class");
                    if (typeof fecha == 'undefined') {

                      var fechaEvento = "";

                    }else{

                      var fechaEvento = $("#fechaEvento").val();
                    }

                    var dataString = "idAgente=" + idAgente + "&fechaEvento=" + fechaEvento + "&listarCalendario=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.miCalendario = data;
                          window.location.href = "calendario.html";
                        } else if (data == "failed") {
                          //swal("Upss", "No hay eventos creados.", "info");
                          var calendario = '[]';
                          localStorage.miCalendario = calendario;
                          window.location.href = "calendario.html";

                        }
                      }
                    })
                  }
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo editar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

  })
  /**********EDITAR VISITA************/
  /**********EDITAR CITA************/
  $("#editarCita").click(function(){
      var idEvento = $("#idEventoRecordatorio").val();
      var idProspecto = $("#idProspectoEdicion").val();
      var nombreProspecto = $("#nombreProspectoRecordatorioEdicion").val();
      var lugar = $("#lugarRecordatorioEdicion").val();
      var lat = $("#latRecordatorioEdicion").val();
      var long = $("#longRecordatorioEdicion").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorioEdicion").val();
      var fecha = $("#fechaRecordatorioEdicion").val();
      var hora = $("#horaRecordatorioEdicion").val();
      var descripcion = $("#descripcionRecordatorioEdicion").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&idEvento=" + idEvento + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&lugar=" + lugar + "&lat=" + lat + "&long=" + long + "&editarCita=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Cita Actualizada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {
                  var idAgente = localStorage.idUsuario;
                  if (localStorage.pendientes == "true") {
                    var dataString = "idAgente=" + idAgente + "&listarPendientes=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.misPendientes = data;
                          window.location.href = "pendientes.html";
                        } else if (data == "failed") {
                          swal("Upss", "No hay eventos pendientes por finalizar.", "info");

                        }
                      }
                    })

                  }else{

                    var fecha = $("#fechaEvento").attr("class");
                    if (typeof fecha == 'undefined') {

                      var fechaEvento = "";

                    }else{

                      var fechaEvento = $("#fechaEvento").val();
                    }

                    var dataString = "idAgente=" + idAgente + "&fechaEvento=" + fechaEvento + "&listarCalendario=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.miCalendario = data;
                          window.location.href = "calendario.html";
                        } else if (data == "failed") {
                          //swal("Upss", "No hay eventos creados.", "info");
                          var calendario = '[]';
                          localStorage.miCalendario = calendario;
                          window.location.href = "calendario.html";

                        }
                      }
                    })
                  }
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo editar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

  })
  /**********EDITAR CITA************/
  /**********EDITAR LLAMADA************/
  $("#editarLlamada").click(function(){
      var idEvento = $("#idEventoRecordatorio").val();
      var idProspecto = $("#idProspectoEdicion").val();
      var nombreProspecto = $("#nombreProspectoRecordatorioEdicion").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorioEdicion").val();
      var fecha = $("#fechaRecordatorioEdicion").val();
      var hora = $("#horaRecordatorioEdicion").val();
      var descripcion = $("#descripcionRecordatorioEdicion").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&idEvento=" + idEvento + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&editarLlamada=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Lllamada Actualizada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {
                  var idAgente = localStorage.idUsuario;
                  if (localStorage.pendientes == "true") {
                    var dataString = "idAgente=" + idAgente + "&listarPendientes=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.misPendientes = data;
                          window.location.href = "pendientes.html";
                        } else if (data == "failed") {
                          swal("Upss", "No hay eventos pendientes por finalizar.", "info");

                        }
                      }
                    })

                  }else{

                    var fecha = $("#fechaEvento").attr("class");
                    if (typeof fecha == 'undefined') {

                      var fechaEvento = "";

                    }else{

                      var fechaEvento = $("#fechaEvento").val();
                    }

                    var dataString = "idAgente=" + idAgente + "&fechaEvento=" + fechaEvento + "&listarCalendario=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.miCalendario = data;
                          window.location.href = "calendario.html";
                        } else if (data == "failed") {
                          //swal("Upss", "No hay eventos creados.", "info");
                          var calendario = '[]';
                          localStorage.miCalendario = calendario;
                          window.location.href = "calendario.html";

                        }
                      }
                    })
                  }
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo editar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

  })
  /**********EDITAR LLAMADA************/
  /**********EDITAR RECORDATORIOS************/
  $("#editarRecordatorio").click(function(){
      var idEvento = $("#idEventoRecordatorio").val();
      var idProspecto = $("#idProspectoEdicion").val();
      var nombreProspecto = $("#nombreProspectoRecordatorioEdicion").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorioEdicion").val();
      var fecha = $("#fechaRecordatorioEdicion").val();
      var hora = $("#horaRecordatorioEdicion").val();
      var descripcion = $("#descripcionRecordatorioEdicion").val();

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&idEvento=" + idEvento + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&editarRecordatorio=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Recordatorio Actualizado Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {
                  var idAgente = localStorage.idUsuario;
                  if (localStorage.pendientes == "true") {
                    var dataString = "idAgente=" + idAgente + "&listarPendientes=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.misPendientes = data;
                          window.location.href = "pendientes.html";
                        } else if (data == "failed") {
                          swal("Upss", "No hay eventos pendientes por finalizar.", "info");

                        }
                      }
                    })

                  }else{

                    var fecha = $("#fechaEvento").attr("class");
                    if (typeof fecha == 'undefined') {

                      var fechaEvento = "";

                    }else{

                      var fechaEvento = $("#fechaEvento").val();
                    }

                    var dataString = "idAgente=" + idAgente + "&fechaEvento=" + fechaEvento + "&listarCalendario=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.miCalendario = data;
                          window.location.href = "calendario.html";
                        } else if (data == "failed") {
                          //swal("Upss", "No hay eventos creados.", "info");
                          var calendario = '[]';
                          localStorage.miCalendario = calendario;
                          window.location.href = "calendario.html";

                        }
                      }
                    })
                  }
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo editar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

  })
  /**********EDITAR RECORDATORIOS************/
  /**********EDITAR DEMOSTRACIONES************/
  $("#editarDemostracion").click(function(){
      var idEvento = $("#idEventoRecordatorio").val();
      var idProspecto = $("#idProspectoEdicion").val();
      var nombreProspecto = $("#nombreProspectoRecordatorioEdicion").val();
      var lugar = $("#lugarRecordatorioEdicion").val();
      var lat = $("#latRecordatorioEdicion").val();
      var long = $("#longRecordatorioEdicion").val();
      var idAgente = localStorage.idUsuario;
      var titulo = $("#tituloRecordatorioEdicion").val();
      var fecha = $("#fechaRecordatorioEdicion").val();
      var hora = $("#horaRecordatorioEdicion").val();
      var descripcion = $("#descripcionRecordatorioEdicion").val();
      var productos = $("#productosRecordatorioEdicion").val();


      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&idEvento=" + idEvento + "&titulo=" + titulo + "&fecha=" + fecha + "&hora=" + hora + "&descripcion=" + descripcion + "&nombreProspecto=" + nombreProspecto + "&lugar=" + lugar + "&lat=" + lat + "&long=" + long + "&productos=" + productos + "&editarDemostracion=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: "Demostracion Actualizada Correctamente",
                text: "",
                icon: "success",
                button: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {
                  var idAgente = localStorage.idUsuario;
                  if (localStorage.pendientes == "true") {
                    var dataString = "idAgente=" + idAgente + "&listarPendientes=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.misPendientes = data;
                          window.location.href = "pendientes.html";
                        } else if (data == "failed") {
                          swal("Upss", "No hay eventos pendientes por finalizar.", "info");

                        }
                      }
                    })

                  }else{

                    var fecha = $("#fechaEvento").attr("class");
                    if (typeof fecha == 'undefined') {

                      var fechaEvento = "";

                    }else{

                      var fechaEvento = $("#fechaEvento").val();
                    }

                    var dataString = "idAgente=" + idAgente + "&fechaEvento=" + fechaEvento + "&listarCalendario=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.miCalendario = data;
                          window.location.href = "calendario.html";
                        } else if (data == "failed") {
                          //swal("Upss", "No hay eventos creados.", "info");
                          var calendario = '[]';
                          localStorage.miCalendario = calendario;
                          window.location.href = "calendario.html";

                        }
                      }
                    })
                  }

                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo editar el recordatorio.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

  });
  /**********EDITAR DEMOSTRACIONES************/
  $("#finalizar").click(function(){
      window.location.href ="finalizacionEvento.html";
      })
  /**********FINALIZAR EVENTO************/
  $("#finalizarEvento").click(function(){
      var idEvento = $("#idEventoFinalizacion").val();
      var idProspecto = $("#idProspectoFinalizacion").val();
      var nombreProspecto = $("#nombreProspectoFinalizacion").val();
      var idAgente = localStorage.idUsuario;
      var nombreAgente = localStorage.nombre;
      var detalleEvento = $("#detalleEventoFinalizacion").val();

      var evento = localStorage.getItem("evento");

      switch (evento) {
        case 'citas':
          var nombreEvento = "Cita";
          var alertaTitulo = "Cita Finalizada Exitosamente";
          break;
        case 'llamada':
          var nombreEvento = "Llamada";
          var alertaTitulo = "Llamada Finalizada Exitosamente";
          break;
        case 'visitas':
          var nombreEvento = "Visita";
          var alertaTitulo = "Visita Finalizada Exitosamente";
          break;
        case 'recordatorios':
          var nombreEvento = "Recordatorio";
          var alertaTitulo = "Recordatorio Finalizado Exitosamente";
          break;
        case 'demostraciones':
          var nombreEvento = "Demostracion";
          var alertaTitulo = "Demostracion Finalizada Exitosamente";
          break;

      }

      var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&idEvento=" + idEvento + "&detalleEvento=" + detalleEvento + "&nombreEvento=" + nombreEvento + "&evento=" + evento + "&nombreAgente=" + nombreAgente + "&nombreProspecto=" + nombreProspecto + "&finalizarEvento=";
      if ($.trim(idAgente).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              swal({
                title: ""+alertaTitulo+"",
                text: "Deseas agregar un nuevo seguimiento",
                icon: "success",

                buttons: ["Nuevo Seguimiento", "Cerrar"],
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {

                  var idAgente = localStorage.idUsuario;
                  if (localStorage.pendientes == "true") {
                    var dataString = "idAgente=" + idAgente + "&listarPendientes=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.misPendientes = data;
                          window.location.href = "pendientes.html";
                        } else if (data == "failed") {
                          swal("Upss", "No hay eventos pendientes por finalizar.", "info");

                        }
                      }
                    })

                  }else{

                    var fecha = $("#fechaEvento").attr("class");
                    if (typeof fecha == 'undefined') {

                      var fechaEvento = "";

                    }else{

                      var fechaEvento = $("#fechaEvento").val();
                    }

                    var dataString = "idAgente=" + idAgente + "&fechaEvento=" + fechaEvento + "&listarCalendario=";
                    $.ajax({
                      type: "POST",
                      url: url,
                      data: dataString,
                      crossDomain: true,
                      cache: false,
                      success: function(data) {
                        if (data != "failed") {
                          localStorage.miCalendario = data;
                          window.location.href = "calendario.html";
                        } else if (data == "failed") {
                          //swal("Upss", "No hay eventos creados.", "info");
                          var calendario = '[]';
                          localStorage.miCalendario = calendario;
                          window.location.href = "calendario.html";

                        }
                      }
                    })
                  }

                }else{
                   window.location.href = "nuevasAcciones.html";
                }
              });
            } else if (data == "failed") {
              swal("Upss", "No se pudo finalizar el evento.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

  });
  /**********FINALIZAR EVENTO************/
  /***********MOSTRAR PENDIENTES***************/
  $(".btnPendientes").click(function() {

    var idAgente = localStorage.idUsuario;
    localStorage.setItem("pendientes","true");

    var dataString = "idAgente=" + idAgente + "&listarPendientes=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.misPendientes = data;
            window.location.href = "pendientes.html";
          } else if (data == "failed") {
            swal("Upss", "No hay eventos pendientes por finalizar.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********MOSTRAR PENDIENTES****************/
  /**********OBTENER DETALLES DE VENTA********/
  $('body').on('click', '#contenedorVentas a', function(){
      var idVenta = $(this).attr("idVenta");
      var dataString = "idVenta=" + idVenta + "&obtenerDetalleVenta=";

      if ($.trim(idVenta).length > 0) {
        $.ajax({
          type: "POST",
          url: url,
          data: dataString,
          crossDomain: true,
          cache: false,
          success: function(data) {
            if (data != "failed") {
              localStorage.detalleVenta = data;
              window.location.href = "detalleVenta.html";
            } else if (data == "failed") {
              swal("Upss", "No se pudo obtener los datos de la venta.", "info");

            }
          }
        })
      } else {
        swal("Ha Ocurrido un Error", "", "error");
      }
      return false;

  });
  /**********OBTENER DETALLES DE VENTA********/
  /**********OBTENER LISTA DE PRECIOS ESPECIALES********/
  $("#btnMostrarListaPrecios").click(function(){
    var idAgente = localStorage.idUsuario;
    var dataString = "idAgente=" + idAgente + "&obtenerListaPrecios=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.preciosEspeciales = data;
            window.location.href = "listaPrecios.html";
          } else if (data == "failed") {
             window.open(`https://sanfranciscodekkerlab.com/crm/listaPrecios.pdf`, '_system');
             //window.open(`../listaPrecios.pdf`, '_system');
            //window.location.href = "listaPrecios.html";
            //swal("Upss", "No se pudo obtener la lista de precios.", "info");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********OBTENER LISTA DE PRECIOS ESPECIALES********/
  /************BUSCADOR LISTA DE PRECIOS************/
  $("#buscadorPrecios").keypress(function(e) {
    if (e.which == 13) {
      return false;
    }
  });
  $('#datosProductoBusqueda').on('keyup', function (e) {
    var nodos = document.getElementById('tablaPrecios');
    while (nodos.firstChild) {
      nodos.removeChild(nodos.firstChild);
    }
    e.preventDefault(); // se previene la acción por defecto
    var search =  $("#datosProductoBusqueda").val();
    localStorage.setItem("busqueda", search);
    var busqueda = localStorage.getItem("busqueda");
    var idAgente = localStorage.getItem("idUsuario");
    var dataString = "search=" + busqueda + "&idAgente=" + idAgente + "&listarResultadosBusquedaPrecios=";

    if ($.trim(busqueda).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        beforeSend: function() {
          var nodos = document.getElementById('tablaPrecios');
          while (nodos.firstChild) {
            nodos.removeChild(nodos.firstChild);
          }
        },
        success: function(data) {

          if (data != "failed") {
            var json = data;
            var types = JSON.parse(json);
            $("#tablaPrecios").html("");
            $("#fila").html("");
            for (x = 0; x < types.length; x++) {

              var fila = `<tr id="fila"><td>`+types[x]["codigo"]+`</td><td>`+types[x]["producto"]+`</td><td>`+types[x]["precioPublico"]+`</td><td>`+types[x]["precioEspecial"]+`</td><td>`+types[x]["descuento"]+`</td></tr>`;

              $("#tablaPrecios").append(fila);

            }

            var divVacio = `<div class="contenedorVacio">
            </div>`;
            $("#tablaPrecios").append(divVacio);

          } else if (data == "failed") {

          }
        }
      })
    } else {
      var nodos = document.getElementById('tablaPrecios');
      while (nodos.firstChild) {
        nodos.removeChild(nodos.firstChild);
      }
      var json = localStorage.preciosEspeciales;
      var types = JSON.parse(json);
      $("#tablaPrecios").html("");
      $("#fila").html("");
      for (x = 0; x < types.length; x++) {

        var fila = `<tr id="fila"><td>`+types[x]["codigo"]+`</td><td>`+types[x]["producto"]+`</td><td>`+types[x]["precioPublico"]+`</td><td>`+types[x]["precioEspecial"]+`</td><td>`+types[x]["descuento"]+`</td></tr>`;

        $("#tablaPrecios").append(fila);

      }

      var divVacio = `<div class="contenedorVacio">
      </div>`;
      $("#tablaPrecios").append(divVacio);
    }
    return false;
  });
  /***********BUSCADOR LISTA DE PRECIOS************/
  /**********GENERAR SPEECH********/
  $("#btnSpeech").click(function(){
    var idAgente = localStorage.idUsuario;
    var idProspecto = localStorage.idProspecto;
    var dataString = "idAgente=" + idAgente +  "&idProspecto=" + idProspecto + "&obtenerSpeech=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {
            localStorage.datosSpeech = data;
            window.location.href = "speech.html";
          } else if (data == "failed") {
            window.location.href = "speech.html";
            localStorage.removeItem("datosSpeech");
            localStorage.removeItem("idSpeech");

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  $("#generarSpeech").click(function(){
    var idAgente = localStorage.idUsuario;
    var idProspecto = localStorage.idProspecto;
    var productosCalidad = $("#productosCalidad").val();

    var problemasCalidad = $("#problemasCalidad").val();
    var asesoramientoCalidad = $("#asesoramientoCalidad").val();
    var entregasServicio = $("#entregasServicio").val();
    var igualadoServicio = $("#igualadoServicio").val();
    var atencionServicio = $("#atencionServicio").val();
    var productosFueraPrecio = $("#productosFueraPrecio").val();
    var preciosFueraPrecio = $("#preciosFueraPrecio").val();
    var canalizado = $("#canalizado").val();
    var canalizadoCon = $("#canalizadoCon").val();
    var dataString = "idAgente=" + idAgente +  "&idProspecto=" + idProspecto +   "&productosCalidad=" + productosCalidad +  "&problemasCalidad=" + problemasCalidad +  "&asesoramientoCalidad=" + asesoramientoCalidad + "&entregasServicio=" + entregasServicio + "&igualadoServicio=" + igualadoServicio +  "&atencionServicio=" + atencionServicio + "&productosFueraPrecio=" + productosFueraPrecio + "&preciosFueraPrecio=" + preciosFueraPrecio + "&canalizado=" + canalizado + "&canalizadoCon=" + canalizadoCon + "&generarSpeech=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {

            var idAgente = localStorage.idUsuario;
            var idProspecto = localStorage.idProspecto;
            var dataString = "idAgente=" + idAgente +  "&idProspecto=" + idProspecto + "&obtenerSpeech=";
            $.ajax({
              type: "POST",
              url: url,
              data: dataString,
              crossDomain: true,
              cache: false,
              success: function(data) {
                if (data != "failed") {
                  localStorage.datosSpeech = data;
                  window.location.href = "speech.html";
                } else if (data == "failed") {
                  window.location.href = "speech.html";

                }
              }
            })
          } else if (data == "failed") {
            window.location.href = "speech.html";

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********GENERAR SPEECH********/
    /**********ACTUALIZAR SPEECH********/
  $("#actualizarSpeech").click(function(){
    var idAgente = localStorage.idUsuario;
    var idSpeech = localStorage.idSpeech;
    var idProspecto = localStorage.idProspecto;
    var productosCalidad = $("#productosCalidad").val();

    var problemasCalidad = $("#problemasCalidad").val();
    var asesoramientoCalidad = $("#asesoramientoCalidad").val();
    var entregasServicio = $("#entregasServicio").val();
    var igualadoServicio = $("#igualadoServicio").val();
    var atencionServicio = $("#atencionServicio").val();
    var productosFueraPrecio = $("#productosFueraPrecio").val();
    var preciosFueraPrecio = $("#preciosFueraPrecio").val();
    var canalizado = $("#canalizado").val();
    var canalizadoCon = $("#canalizadoCon").val();
    var dataString = "idAgente=" + idAgente +  "&idProspecto=" + idProspecto + "&idSpeech=" + idSpeech +  "&productosCalidad=" + productosCalidad +  "&problemasCalidad=" + problemasCalidad +  "&asesoramientoCalidad=" + asesoramientoCalidad + "&entregasServicio=" + entregasServicio + "&igualadoServicio=" + igualadoServicio +  "&atencionServicio=" + atencionServicio + "&productosFueraPrecio=" + productosFueraPrecio + "&preciosFueraPrecio=" + preciosFueraPrecio + "&canalizado=" + canalizado + "&canalizadoCon=" + canalizadoCon + "&actualizarSpeech=";

    if ($.trim(idAgente).length > 0) {
      $.ajax({
        type: "POST",
        url: url,
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function(data) {
          if (data != "failed") {

            var idAgente = localStorage.idUsuario;
            var idProspecto = localStorage.idProspecto;
            var dataString = "idAgente=" + idAgente +  "&idProspecto=" + idProspecto + "&obtenerSpeech=";
            $.ajax({
              type: "POST",
              url: url,
              data: dataString,
              crossDomain: true,
              cache: false,
              success: function(data) {
                if (data != "failed") {
                  localStorage.datosSpeech = data;
                  window.location.href = "speech.html";
                } else if (data == "failed") {
                  window.location.href = "speech.html";

                }
              }
            })
          } else if (data == "failed") {
            window.location.href = "speech.html";

          }
        }
      })
    } else {
      swal("Ha Ocurrido un Error", "", "error");
    }
    return false;

  });
  /**********ACTUALIZAR SPEECH********/
  /**********SERVICIO POSTVENTA********/
  $("#btnServicioPostVenta").click(function(){

    var prospectoId = $(this).attr('prospectoId');
    var json = localStorage.detalleVenta;
    var detalle = JSON.parse(json);

    for (x = 0; x < detalle.length; x++) {
        var idVenta = detalle[x]["id"];
        var nombreProspecto = detalle[x]["nombreCompleto"];
    }

    var titulo = "Porfavor copie el siguiente link para enviarlo a ";
    var subtitulo = " y pueda contestar la encuesta de satisfacción.";
    $("#tituloPostVenta").html(titulo);
    $("#nombre").html(nombreProspecto);
    $("#subtituloPostVenta").html(subtitulo);

    var link = "https://sanfranciscodekkerlab.com/postventa?keyUser="+prospectoId+"&keySale="+idVenta;
    $("#linkPostventa").html(link);

  });

  /**********SERVICIO POSTVENTA********/
  /******SALIR DE LA APLICACION************/
  $(".btnSalir").click(function() {
    swal({
      title: "Cerrar sesion",
      text: "Seguro que deseas salir?",
      icon: "warning",
      buttons: {
        cancel: "Regresar",
        default:"Salir",
      },
    })
    .then((willDelete) => {
      if (willDelete) {
        localStorage.login = "false";
        localStorage.removeItem('arregloProspectos');
        localStorage.removeItem('arregloOportunidades');
        localStorage.removeItem('idUsuario');
        localStorage.removeItem('busqueda');
        localStorage.removeItem('detalleProspecto');
        localStorage.removeItem('area');
        localStorage.removeItem('nombre');
        localStorage.removeItem('listaFaseProspectos');
        localStorage.removeItem('listaTitulosProspectos');
        localStorage.removeItem('listaOrigenProspectos');
        localStorage.removeItem('prospectoId');
        //localStorage.removeItem('listaGeneralProspectos');
        localStorage.removeItem('latitudProspecto');
        localStorage.removeItem('longitudProspecto');
        localStorage.removeItem('longitudAgente');
        localStorage.removeItem('latitudAgente');
        localStorage.removeItem('autocomplete');
        localStorage.removeItem('idProspecto');
        localStorage.removeItem('ventasRealizadas');
        localStorage.removeItem('detalleSeguimientos');
        localStorage.removeItem('idOportunidad');
        localStorage.removeItem('accion');
        localStorage.removeItem('datosProspecto');
        localStorage.removeItem('arregloClientes');
        localStorage.removeItem('datosOportunidadVenta');
        localStorage.removeItem('oportunidadesVenta');
        localStorage.removeItem('listarFaseOportunidades');
        localStorage.removeItem('listarCertezas');
        localStorage.removeItem('seguimientos');
        localStorage.removeItem('detalleEvento');
        localStorage.removeItem('miCalendario');
        localStorage.removeItem('sliderData');
        localStorage.removeItem('pendientes');
        localStorage.removeItem('misPendientes');
        localStorage.removeItem('idEvento');
        localStorage.removeItem('evento');
        localStorage.removeItem('detalleVenta');
        localStorage.removeItem('preciosEspeciales');
        window.location.href = "login.html";
      } else{

      }
    });

  });
  /******SALIR DE LA APLICACIÓN***********/

});
