$(document).ready(function() {
    //var url = "https://sanfranciscodekkerlab.com/matriz/auth.php?callback=?";
    //var url = "http://192.168.1.245/blitz/authenticador.php?callback=?";
    var url = "https://sanfranciscodekkerlab.com/blitz/authenticador.php?callback=?";

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

                        // Obteniendo todas las claves del JSON
                        var json = data;
                        console.log(json);
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
                                window.location.href = "index.html";
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

});
