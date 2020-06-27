/**
 * MENU LATERAL
 */
 $(document).ready(main);

var contador = 1;

function main(){
	$('.menu_bar').click(function(){
		// $('nav').toggle();

		if(contador == 1){
			$('nav').animate({
				left: '0'
			});
			contador = 0;
		} else {
			contador = 1;
			$('nav').animate({
				left: '-100%'
			});
		}

	});

};
/**
 * ASIGNAR NOMBRE DE AGENTE A LATERAL
 */
 var agente = localStorage.getItem("nombre");
 $("#nombreAgente").text(agente);

 /**
  * Obtener ubicacion de agente de venta
  */
  const funcionInit = () => {
  	if (!"geolocation" in navigator) {
  		return alert("Tu navegador no soporta el acceso a la ubicación. Intenta con otro");
  	}

  	const $latitud = document.querySelector("#latitud"),
  		$longitud = document.querySelector("#longitud"),
  		$enlace = document.querySelector("#enlace");


  	const onUbicacionConcedida = ubicacion => {

  		const coordenadas = ubicacion.coords;
  		var coordenada = localStorage.getItem("latitudAgente");
  		if (coordenada === null) {
  			localStorage.setItem("latitudAgente",coordenadas.latitude);
  			localStorage.setItem("longitudAgente",coordenadas.longitude);

  		}else{


  		}
  			$latitud.innerText = coordenadas.latitude;
  			$longitud.innerText = coordenadas.longitude;
        var coordenadasProspectos = coordenadas.latitude+","+coordenadas.longitude;
        $("#coordenadasPerfil").val(coordenadasProspectos);


  	}
  	const onErrorDeUbicacion = err => {

  		$latitud.innerText = "Error obteniendo ubicación: " + err.message;
  		$longitud.innerText = "Error obteniendo ubicación: " + err.message;
  		console.log("Error obteniendo ubicación: ", err);
  	}

  	const opcionesDeSolicitud = {
  		enableHighAccuracy: true, // Alta precisión
  		maximumAge: 0, // No queremos caché
  		timeout: 5000 // Esperar solo 5 segundos
  	};

  	$latitud.innerText = "Cargando...";
  	$longitud.innerText = "Cargando...";
  	navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud);

  };
  $("#obtenerUbicacion").click(function(){
			funcionInit();
      var geocoder = new google.maps.Geocoder;
      geocodeLatLng(geocoder);

      function geocodeLatLng(geocoder) {

             var latlng = {lat: parseFloat(localStorage.getItem("latitudAgente")), lng: parseFloat(localStorage.getItem("longitudAgente"))};
             geocoder.geocode({'location': latlng}, function(results, status) {
               if (status === 'OK') {
                 if (results[0]) {

                  var direccion = localStorage.getItem("autocomplete");

                  if (direccion === null) {

                   localStorage.setItem("autocomplete",results[0].formatted_address);
                   $("#direccionPerfil").val(results[0].formatted_address);

                  }else{

                    localStorage.setItem("autocomplete",results[0].formatted_address);
                    $("#direccionPerfil").val(results[0].formatted_address);
                  }

                 } else {
                   //window.alert('No results found');
                 }
               } else {
                 console.log('Geocoder failed due to: ' + status);
                 //window.alert();
               }
             });
           }
  });
  /*******VACIAR LOCALSTORAGE AL REGRESAR LA EDICION********/
  $("#btnRegresarEdicion").click(function(){
      localStorage.removeItem('detalleProspecto');
      localStorage.removeItem('listaFaseProspectos');
      localStorage.removeItem('listaTitulosProspectos');
      localStorage.removeItem('listaOrigenProspectos');
      localStorage.removeItem('latitudProspecto');
      localStorage.removeItem('longitudProspecto');
      localStorage.removeItem('idProspecto');
      localStorage.removeItem('seguimientos');

  })
  /*******VACIAR LOCALSTORAGE AL REGRESAR ACCIONES********/
  $("#btnRegresarAcciones").click(function(){
      localStorage.removeItem('sesionOportunidades');
      localStorage.removeItem('idOportunidad');

  })
  /*******VACIAR LOCALSTORAGE AL REGRESAR CONVERTIR A VENTA********/
  $("#btnRegresarVenta").click(function(){
      localStorage.removeItem('oportunidadesVenta');

  })
  $("#btnRegresarCerrarVenta").click(function(){
      localStorage.removeItem('datosOportunidadVenta');

  })
  /****CARGAR PRODUCTOS DE DEMOSTRACION*********/
  $("#listaProductosDemostracion").change(function(){

  });
  /****CARGAR PRODUCTOS DE DEMOSTRACION*********/
  /************LEER QR COTIZACION **************/
  $("#btnLeerQr").click(function(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          if(!result.cancelled){
                 // En este caso solo queremos que procese código QR
                 if(result.format == "QR_CODE"){
                      var value = result.text;
                      var json = value;
                      var datosCotizacion = JSON.parse(json);

                      for (i = 0; i < datosCotizacion.length; i++) {
                        var concepto = $("#conceptoOportunidad").val(datosCotizacion[i]["concepto"]);
                        var monto = $("#montoOportunidad").val(datosCotizacion[i]["monto"]);
                        var productos = datosCotizacion[i]["productos"];
                        var codigos = datosCotizacion[i]["codigos"];
                        var product = document.getElementById("productosOportunidad");
                        product.setAttribute("value",productos);
                        var codigo = document.getElementById("codigosOportunidad");
                        codigo.setAttribute("value",codigos);

                        var separador = ",";
                        var arregloProductos = productos.split(separador);
                        var arregloCodigos = codigos.split(separador);

                        $("#tablaProductos").html("");
                        $("#fila").html("");
                        for (var x=0; x < arregloProductos.length; x++) {

                          var fila = `<tr id="fila"><td>`+arregloCodigos[x]+`</td><td>`+arregloProductos[x]+`</td></tr>`;
                            $("#tablaProductos").append(fila);
                         }

                      }

                 }else{
                    alert("Ops, se escaneo un código pero al parecer no es QR");
                 }
          }else{
            alert("El usuario se ha saltado el escaneo.");
          }
       },
       function (error) {
            alert("Ha ocurrido un error: " + error);
       }
      );
  });
  /************LEER QR COTIZACION **************/
