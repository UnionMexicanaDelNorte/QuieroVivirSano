<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Quiero ¡Vivir Sano! ::: Registrarme</title>
<script src="library/plugins/jQuery/jQuery-2.2.0.min.js"></script>
<link href="library/checkin.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="library/bootstrap/dist/css/bootstrap.css">
<link rel="stylesheet" href="admin/jquery-ui.min.css" />
<script src="admin/jquery-ui.min.js"></script>

<script src="library/bootstrap/dist/js/bootstrap.min.js"></script>
</head>

<body class="formBackground">
<div>
	<header class="checkinPage">
            <img class="imageTop" src="img/peopleCelphone.png">
    		<img class="imageLogo" src="img/cursoEnLinea.png"><img class="imageLogo" src="img/logo.png"> 
    </header>
    <section >    
    </section>
  	<footer>
        <div class="contentForm">	
          <div class="form">
            <div class="formData">
                <div><img class="imageTop" src="img/paso1.png"></div>
                <div class="title1">MI REGISTRO</div>
                <div class="form-style-2">
					<form method="post" name="form1" action="access.php" >
                    <label for="nombre">
                    	<span>Nombre</span>
                        <input class="input-field size1"  type="text" id="nombre" name="nombre" accesskey="n" tabindex="1" value="" />
                    </label>
                    <label for="edad">
                    	<span>Edad</span>
                        <input class="input-field size2" type="number" name="edad" id="edad" accesskey="e" tabindex="2"/>
                    </label>
                    
                        <div class="radioButton">
                        <label>
                    		<span>Sexo</span>
                        </label>
                            <input type="radio" name="gender" checked="checked" value="female"><span>Femenino</span>
                            <input type="radio" name="gender" value="male"><span>Masculino</span>
                         
    	                </div>
    	            <label for="pais">
                    	<span>País</span>
                        <input class="input-field size4"  type="text" id="pais" name="pais" accesskey="p" tabindex="4" value="" />
                    </label>
                    <label for="ciudades">
                    	<span>Ciudad</span>
                        <input class="input-field size3" type="text" id="ciudades" name="ciudad" tabindex="3" accesskey="c" value=""/>
                    </label>
                    <label for="religion">
                    	<span>Religión</span>
                        <input class="input-field size3" type="text" name="religion" id="religion" accesskey="r" tabindex="5"/>
                    </label>
                    <label for="correo">
                    	<span>Correo electrónico</span>
                        <input class="input-field size3" type="text" id="correo" name="correo" tabindex="6" accesskey="m" value=""/>
                    </label>
                    <label for="password">
                    	<span>Contraseña</span>
                        <input class="input-field size5" type="password" id="pass1" name="password" tabindex="6" accesskey="m" value=""/>
                    </label>
                    <label for="confirmar">
                    	<span>Confirmar</span>
                        <input class="input-field size5" type="password" id="pass2" name="confirmar" tabindex="6" accesskey="m" value=""/>
                    </label>

                     <div class="botones">
                         <input class="btn center-block btn-magenta" type="button" id="registrarse" value="REGISTRARME">
                         <input type="hidden" name="MM_insert" value="form1">
					</div>
                    </form>
				</div>
            </div>                  
          </div>
          <div class="posBottomImg">
                <img src="img/celphone.png">
          </div>
        </div>
    </footer>
</div>
</body>
<script type="text/javascript">

function autocompleteCiudades() {

	/*var ciudades = new Array();
	ciudades.push({label:"Montemorelos", name:0 });
	ciudades.push({label:"Tuxtla", name:0 });
	ciudades.push({label:"Monterrey", name:0 });
	ciudades.push({label:"Guadalajara", name:0 });
	ciudades.push({label:"Ciudad de México", name:0 });
	ciudades.push({label:"Villahermosa", name:0 });
	
	$("#ciudades").autocomplete({
		source : ciudades,
		select : function(event,ui) {
			$("#ciudad").val(ui.item.label);	
		}
	});*/

	var param = {
		servicio : "app",
		accion : "getAllPaises",
	}
	var api="/app/qvs.php";
	$.ajax({
		url: api,
		data : param,
		dataType : "json",
		type : "post",
		async : true,
		beforeSend : function (){
		},
		complete : function (){
		}, 
		success : function (resp){
			if(resp.success==1)
			{
				var ciudades = new Array();
				var i = 0;
				for(i=0;i<resp.paises.length;i++)
				{
					ciudades.push({label:resp.paises[i].nombre, name:resp.paises[i].iso3 });
	
				}
				$("#pais").autocomplete({
					source : ciudades,
					select : function(event,ui) {
						$("#pais").val(ui.item.label);	
						var iso3 = ui.item.name;
						actualizaCiudades(iso3);

					}
				});
			}
		}
	});
}
function actualizaCiudades(iso3)
{

	var param = {
		servicio : "app",
		accion : "getAllCiudadesByCiudad",
		pais : iso3
	}
	var api="/app/qvs.php";
	$.ajax({
		url: api,
		data : param,
		dataType : "json",
		type : "post",
		async : true,
		beforeSend : function (){
		},
		complete : function (){
		}, 
		success : function (resp){
			if(resp.success==1)
			{
				var ciudades = new Array();
				var i = 0;
				for(i=0;i<resp.ciudades.length;i++)
				{
					ciudades.push({label:resp.ciudades[i].CiudadNombre, name:resp.ciudades[i].CiudadNombre });
	
				}
				$("#ciudades").autocomplete({
					source : ciudades,
					select : function(event,ui) {
						$("#ciudades").val(ui.item.label);	
					}
				});
			}
		}
	});
}
autocompleteCiudades();
function validateText(idText) {
	var contenido = $("#"+idText).val().trim();
	if(contenido =="")
	{
		return false;
	}
	return true;
}
$(document).on("click","#registrarse", function() {
if(!validateText("correo")){alert("Campo(s) requerido(s)");return;}
if(!validateText("nombre")){alert("Campo(s) requerido(s)");return;}
if(!validateText("edad")){alert("Campo(s) requerido(s)");return;}
if(!validateText("ciudades")){alert("Campo(s) requerido(s)");return;}
if(!validateText("religion")){alert("Campo(s) requerido(s)");return;}
if(!validateText("pais")){alert("Campo(s) requerido(s)");return;}
if(!validateText("pass1")){alert("Campo(s) requerido(s)");return;}
if(!validateText("pass2")){alert("Campo(s) requerido(s)");return;}
var gender = $('input[name="gender"]:checked').val();

var pass1 = $("#pass1").val().trim();
var pass2 = $("#pass2").val().trim();

if(pass1!=pass2)
{
	alert("Los password no coinciden");
	return;
}
var param = {
	servicio : "login",
	accion : "registrarse",
	correo : $("#correo").val(),
	nombre : $("#nombre").val(),
	edad : $("#edad").val(),
	ciudad : $("#ciudades").val(),
	religion : $("#religion").val(),
	pais : $("#pais").val(),
	pass : pass1,
	gender : gender
	}
	var api="/app/qvs.php";
	$.ajax({
			url: api,
			data : param,
			dataType : "json",
			type : "post",
			async : true,
			beforeSend : function (){
			},
			complete : function (){
			}, 
			success : function (resp){
				if(resp.success==0)
				{
					alert("¡Hubo un error desconocido!");
				}
				if(resp.success==2)
				{
					alert("El correo ya esta registrado, ¡intenta con otro!");
				}
				if(resp.success==1)
				{
					alert("El usuario se registro con ¡éxito!");
					window.location.href="/app/";

				}
			}
		});
});
</script>
</html>
