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

              var filaProspecto = `<a class="detalleProspecto" idProspecto="`+types[x]["id"]+`"><div class="filaGeneral">
              <div>
              <i class="fas fa-user-circle fa-3x iconos-contenedor"></i>
              </div>
              <div class="nombreProspecto">
              <h4>`+types[x]["nombreCompleto"]+`</h4>
              </div>
              <div class="tallerProspecto">
              <h5><i class="fas fa-map-marked-alt fa-1x iconos"></i> `+types[x]["taller"]+`</h5>
              </div>

              </div></a>`;
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

        var filaProspecto = `<a class="detalleProspecto" idProspecto="`+types[x]["id"]+`"><div class="filaGeneral">
        <div>
        <i class="fas fa-user-circle fa-3x iconos-contenedor"></i>
        </div>
        <div class="nombreProspecto">
        <h4>`+types[x]["nombreCompleto"]+`</h4>
        </div>
        <div class="tallerProspecto">
        <h5><i class="fas fa-map-marked-alt fa-1x iconos"></i> `+types[x]["taller"]+`</h5>
        </div>

        </div></a>`;
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
    var comentariosOportunidad = $("#comentariosOportunidad").val();


    var dataString = "idAgente=" + idAgente + "&idProspecto=" + idProspecto + "&conceptoOportunidad=" + conceptoOportunidad + "&faseOportunidad=" + faseOportunidad + "&montoOportunidad=" + montoOportunidad + "&cierreEstimado=" + cierreEstimado + "&certezaOportunidad=" + certezaOportunidad + "&comentariosOportunidad=" + comentariosOportunidad + "&productosOportunidad=" + productosOportunidad + "&codigosOportunidad=" + codigosOportunidad + "&generarOportunidad=";

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
    var observacionesVenta = $("#observacionesVenta").val();


    var dataString = "idAgente=" + idAgente + "&idOportunidad=" + idOportunidad + "&idOportunidadVenta=" + idOportunidadVenta + "&conceptoVenta=" + conceptoVenta + "&fechaVenta=" + fechaVenta + "&montoVenta=" + montoVenta + "&comisionVenta=" + comisionVenta +  "&observacionesVenta=" + observacionesVenta + "&cerrarVenta=";

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
                      window.location.href = "acciones.html";
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

              swal("Upss", "No hay Ventas Concretadas Aún.", "info");

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
  /**********CDESCARTAR PROSPECTO************/
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
            window.location.href = "calendario.html";
            var calendario = '[]';
            localStorage.miCalendario = calendario;

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
                        window.location.href = "calendario.html";

                      }
                    }
                  })

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
        window.location.href = "login.html";
      } else{

      }
    });

  });
  /******SALIR DE LA APLICACIÓN***********/

});
