<?php
$coincidir="";
$correo="";
if(isset($_GET["c"]))
{
	$coincidir=$_GET["c"];
}
if(isset($_GET["h"]))
{
	$correo=$_GET["h"];
}

if (!isset($_SESSION)) {
  //commit 2 lineas
  ini_set('session.gc_maxlifetime', 36000);
  session_set_cookie_params(36000);
     
  session_start();
}
$_SESSION["c"]=$coincidir;
$_SESSION["h"]=$correo;
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Quiero ¡Vivir Sano!</title>
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
                <!--div><img class="imageTop" src="img/paso1.png"></div-->
                <div class="title1">RECUPERAR CONTRASEÑA</div>
                <div class="form-style-2">
					<form name="form1" >
	                    <label for="password">
	                    	<span>Nueva contraseña</span>
	                        <input class="input-field size5" type="password" id="pass1" name="password" tabindex="2" accesskey="m" value="">
	                    </label>
	                    <label for="confirmar">
	                    	<span>Confirmar nueva contraseña</span>
	                        <input class="input-field size5" type="password" id="pass2" name="confirmar" tabindex="3" accesskey="m" value="">
	                    </label>
	                    <div class="botones">
	                         <input class="btn center-block btn-magenta" type="button" id="cambiar" value="Cambiar contraseña">
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

$(document).on("click","#cambiar", function() {
	var pass1 = $("#pass1").val();
	var pass2 = $("#pass2").val();
	if(pass1=="")
	{
		alert("Te falta un campo por llenar");
		return;
	}
	if(pass2=="")
	{
		alert("Te falta un campo por llenar");
		return;
	}
	if(pass1!=pass2)
	{
		alert("Las contraseñas deben de coincidir.");
	    return;
	}
	var param = {
	    servicio : 'login',
	    accion : 'cambiarContra',
	    pass : pass1
	};
	$.ajax({
	    url: "http://quierovivirsano.org/app/qvs.php",
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
	          alert("La contraseña fue cambiada exitosamente, puedes iniciar sesión con tu nueva contraseña");
	          window.location.href="http://quierovivirsano.org/app/";
	        }
	        if(resp.success==2)
	        {
	          alert("No trates de hackear el sistema.");
	        }
	        if(resp.success==0)
	        {
	          alert("Ocurrió un error desconocido.");
	        }
	    }
	});
});
</script>
</html>
