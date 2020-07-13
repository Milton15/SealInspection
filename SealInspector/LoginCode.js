var ValidateUnitS = appSettings.ValidateUnit;
var AutheticateUserS = appSettings.AutheticateUser;

var csstxtClean = { "border": '', "box-shadow": '' };
var csstxtError = { "border": '2px solid red', "box-shadow": '0 0 1px red' };
var csstxtWarn = { "border": '2px solid blue', "box-shadow": '0 0 1px red' };
var focusInput = { "border": '1px solid rgb(115, 179, 229)', "box-shadow": '0 0 4px rgb(115, 179, 229)' }; //focus
var cleanInput = { "border": "1px solid rgb(204,204,204)", "box-shadow": '0 0 0px gray' }; //normal, sin focus

$(document).ready(function () {

    $(document).on({
        ajaxStart: function () { $("#loading").removeClass("hidden"); },
        ajaxStop: function () { $("#loading").addClass("hidden"); }
    });

    $('#contenedor4,#contenedor7').focus(function () {
        $('#divInput').css(focusInput);
    });
    $('#contenedor4,#contenedor7').blur(function () {
        $('#divInput').css(cleanInput);
    });

    $('#contenedor7').keydown(function (e) {                             //me quede aquiiiiiiiiiii
        var con = $('#contenedor7').val();                                //me quede aquiiiiiiiiiii
        if (e.which == 8 && con == "") { //backspace                      //me quede aquiiiiiiiiiii
            $('#contenedor4').focus();
        }                                                                 //me quede aquiiiiiiiiiii
    });

    //$('#contenedor4').keypress(function(e) {

    //});

    $('#password').keypress(function (e) {
        if (e.which == 13) { //ender
            var username = $('#username').val().trim().toUpperCase();
            var password = $('#password').val().trim();

            validateUser(username, password);
        }
    });

    $('#username,#password,#barco,#viaje,#sello').keypress(function () {
        $(this).css(csstxtClean);
    });
    $('#sello').focus(function () {
        $(this).css(csstxtClean);
    });

    $('#barco,#viaje').keypress(function (e) {
        if (e.which == 13) {

            //Checking for blank fields.
            var barco = $('#barco').val().toUpperCase();
            var viaje = $('#viaje').val().toUpperCase();

            if (barco == '' || viaje == '') {
                $('#barco,#viaje').css(csstxtError);
            } else {
                localStorage.setItem('barco', barco);
                localStorage.setItem('viaje', viaje);
                window.location.href = "Page2.html";
            }
        }
    });

    $('#contenedor4,#contenedor7,#sello').keypress(function (e) {
        if (e.which == 13) {
            validateConteiner();
        }
    });

    $('#btnlogin').click(function () {
        //BUTTON LOG IN
        //Checking for blank fields.
        var username = $('#username').val().trim().toUpperCase();
        var password = $('#password').val().trim();

        validateUser(username, password);
    });

    var validateUser = function (username, password) {

        var vdata = { userObjet: ["{'UserId': '", username, "','Password': '", password, "'}"].join("") };

        if (username == '' || password == '') {
            $('#username,#password').css(csstxtError);
            $('#username').focus();
        } else {

            $.ajax({
                type: 'POST',
                url: AutheticateUserS,
                data: vdata,
                success: function (data) {
                    var rpta = data.getElementsByTagName("boolean")[0].innerHTML;
                    if (rpta == 'true') {
                        localStorage.setItem('user', username);
                        window.location.href = "Page1.html";
                    } else {

                        $('#username,#password').css(csstxtError);
                        $('#username').focus();
                        $.alert({
                            title: 'Error',
                            content: 'Usuario y/o Clave Incorrecta.',
                            animation: 'none',
                            type: 'red',
                            buttons: {
                                ok: {
                                    text: "OK",
                                    btnClass: "btn-red",
                                    action: function () {
                                        $('#username,#password').val("");
                                    }
                                }
                            }
                        });
                    }
                },
                error: function (data) {
                    $.alert({
                        title: 'Error',
                        content: 'Ups! Algo salió mal.',
                        animation: 'none',
                        type: 'red',
                        buttons: {
                            ok: {
                                text: "OK",
                                btnClass: "btn-red",
                                action: function () {
                                    $('#username,#password').val("");
                                }
                            }
                        }
                    });
                }
            });
        }
    };


    $('#btnGuardar').click(function () {
        //BUTTON SAVE BARCO-VIAJE
        //Checking for blank fields.
        var barco = $('#barco').val().toUpperCase();
        var viaje = $('#viaje').val().toUpperCase();

        if (barco == '' || viaje == '') {
            $('#barco,#viaje').css(csstxtError);
            $('#barco').focus();
        } else {
            localStorage.setItem('barco', barco);
            localStorage.setItem('viaje', viaje);
            window.location.href = "Page2.html";
        }

    });

    $('#btnCambiar').click(function () {                                            //BUTTON CHANGE BARCO-VIAJE
        window.location = "Page1.html";
    });

    $('#btnCerrarSesion').click(function () {                                       //BUTTON LOG OUT
        $.confirm({
            title: '¿Cerrar Sesión?',
            content: 'Confirmar',
            type: "red",
            animation: "none",
            buttons: {
                ok: {
                    text: 'SI',
                    btnClass: "btn-red",
                    action: function () {
                        localStorage.setItem('user', "");
                        localStorage.setItem('barco', "");
                        localStorage.setItem('viaje', "");
                        window.location = "Login.html"
                    }
                },
                cancel: {
                    text: 'CANCELAR',

                }
            }
        });
    });



    var validarContenedor = function (contenedorValidate, sello, barco, viaje, user, tryCount) {

        $.ajax({
            type: 'POST',
            url: ValidateUnitS,
            data: {
                "unitToValidate": contenedorValidate,
                "sealNbr": sello,
                "vesselId": barco,//barco
                "visitNbr": viaje,//num viaje
                "userLogged": user,
                "workingArea": "muelle",
                "tryCount": tryCount
            },
            success: function (data) {
                var rpta = data.getElementsByTagName("string")[0].innerHTML;
                var Error = "{\"Message\":\"Error en los Datos, Verifique e Intente de Nuevo\",\"Status\":\"ERROR_DATOS\",\"Operation\":0,\"IsException\":false}";
                var Successful = "{\"Message\":\"Successful\",\"Status\":\"0\",\"Operation\":0,\"IsException\":false}";
                var NoDisponible = "{\"Message\":\"Contenedor Fuera de Lista\",\"Status\":\"NO_DISPONIBLE\",\"Operation\":0,\"IsException\":false}";

                if (tryCount == 2) {
                    if (rpta == NoDisponible) {

                        $.alert({
                            title: 'Info',
                            content: "Verifique e Intente de Nuevo.",
                            animation: 'none',
                            type: 'orange',
                            buttons: {
                                ok: {
                                    text: "OK",
                                    btnClass: "btn-orange",
                                    action: function () {
                                        $('#divInput').css(csstxtWarn);
                                        //$('#contenedor4,#contenedor7, #sello').val("");
                                        $('#contenedor7').focus();
                                    }
                                }
                            }
                        });
                    } else {
                        if (rpta == Successful) {

                            $.alert({
                                title: 'Verificado',
                                content: "Contenedor verificado exitosamente.",
                                animation: 'none',
                                type: 'green',
                                buttons: {
                                    ok: {
                                        text: "OK",
                                        btnClass: "btn-green",
                                        action: function () {
                                            $('#contenedor4,#contenedor7, #sello').val(""); $('#contenedor4').focus();
                                        }
                                    }
                                }
                            });
                        } else {

                            $.alert({
                                title: 'Error',
                                content: "Error con algún dato.",
                                animation: 'none',
                                type: 'red',
                                buttons: {
                                    ok: {
                                        text: "OK",
                                        btnClass: "btn-red",
                                        action: function () {
                                            $('#divInput').css(csstxtError);
                                            $('#contenedor4,#contenedor7, #sello').val(""); $('#contenedor4').focus();
                                        }
                                    }
                                }
                            });
                        }
                    }
                }

            },
            error: function (data) {
                $.alert({
                    title: 'Error',
                    content: 'Ups! Algo salió mal.',
                    animation: 'none',
                    type: 'red',
                    buttons: {
                        ok: {
                            text: "OK",
                            btnClass: "btn-red",
                            action: function () {
                                $('#contenedor4,#contenedor7, #sello').val(""); $('#contenedor4').focus();
                            }
                        }
                    }
                });
            }
        });

        //alert(contenedorValidate + "--" + sello + "--" + barco + "--" + viaje + "--" + user + "--" + tryCount);
    };


    var validateConteiner = function () {

        //Checking for blank fields.
        var contenedor4 = $('#contenedor4').val().toUpperCase();
        var contenedor7 = $('#contenedor7').val();
        var sello = $('#sello').val().toUpperCase();
        var user = localStorage.getItem("user");
        var barco = localStorage.getItem("barco");
        var viaje = localStorage.getItem("viaje");

        if (contenedor4 == '' || sello == '' || contenedor7 == '') {
            $('#divInput,#sello').css(csstxtError);
            $('#contenedor4').focus();
        } else {
            var regex4 = /^[A-Z]{4}$/; // 4 letras
            var regex7 = /^[0-9]{7}$/; // only 7 numbers
            event.preventDefault();
            var validarContenedor4 = $('#contenedor4');
            var validarContenedor7 = $('#contenedor7');
            if (validarContenedor4.val().toUpperCase().match(regex4) && validarContenedor7.val().match(regex7)) {
                var contenedorValidate = contenedor4 + contenedor7;

                var tryCount = 1;

                while (tryCount < 3) {
                    validarContenedor(contenedorValidate, sello, barco, viaje, user, tryCount);
                    tryCount++;
                };

            } else {
                $('#contenedor7').focus();
                $.alert({
                    title: 'Error',
                    content: 'Contenedor no válido',
                    animation: 'none',
                    type: 'red',
                    buttons: {
                        ok: {
                            text: "OK",
                            btnClass: "btn-red",
                            action: function () {
                                $('#divInput').css(csstxtError);
                            }
                        }
                    }
                });
            }
        }

    };

    $('#btnValidar').click(function (event) {
        validateConteiner();
    });

    $("#barco,#viaje,#username,#password,#sello").click(function () {
        $(this).css(csstxtClean);
    });
    $("#contenedor4,#contenedor7").click(function () {
        $('#divInput').css(csstxtClean);
        $('#divInput').css(focusInput);
    });

    $('#contenedor7,#divInput').click(function () {
        var cont = $('#contenedor7').val();
        if (cont == '') {
            $('#contenedor4').focus();
        }
    });
    //solo letras contenedor 4
    $('#contenedor4').keypress(function (e) {
        //if ((tecla.charCode < 65 || tecla.charCode > 90) && (tecla.charCode != 45)) return false;
        return soloLetras(e);

    });

    //solo números contenedor 7
    $('#contenedor7').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57 || this.value.length == 7) {
            return false;
        }
    });
    $('#contenedor7').keyup(function () {

        if (this.value.length === 7) {
            $('#sello').focus();

        }
    });

    //numero, letras y -
    $('#sello').keypress(function (e) {
        return InputSello(e);
    });
});


$(document).on('keyup', "#contenedor4[maxlength]", function (e) {
    var este = $(this),
        maxlength = este.attr('maxlength');

    if (maxlength) {
        var texto = este.val();
        if (texto.length >= maxlength) {
            $('#contenedor7').focus();
        }

    }
});


function soloLetras(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toUpperCase();
    letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    especiales = [8, 13];
    tecla_especial = false;
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial)
        return false;
}

//function soloNumeros(e) {
//    key = e.keyCode || e.which;
//    tecla = String.fromCharCode(key);
//    numeros = "0123456789"
//    especiales = [8, 13];
//    tecla_especial = false
//    for (var i in especiales) {
//        if (key == especiales[i]) {
//            tecla_especial = true;
//            break;
//        }
//    }
//    if (numeros.indexOf(tecla) == -1 && !tecla_especial)
//        return false;
//}

function InputSello(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toUpperCase();
    numeros = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    especiales = [8, 13];
    tecla_especial = false;
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if (numeros.indexOf(tecla) == -1 && !tecla_especial)
        return false;
}


