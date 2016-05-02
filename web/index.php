<?php require_once('Connections/cnnQVS.php'); 

if (!function_exists("GetSQLValueString")) {
function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") 
{
  if (PHP_VERSION < 6) {
    $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
  }

  $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

  switch ($theType) {
    case "text":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;    
    case "long":
    case "int":
      $theValue = ($theValue != "") ? intval($theValue) : "NULL";
      break;
    case "double":
      $theValue = ($theValue != "") ? doubleval($theValue) : "NULL";
      break;
    case "date":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;
    case "defined":
      $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
      break;
  }
  return $theValue;
}
}

// *** Validate request to login to this site.
if (!isset($_SESSION)) {
  session_start();
}

$loginFormAction = $_SERVER['PHP_SELF'];
if (isset($_GET['accesscheck'])) {
  $_SESSION['PrevUrl'] = $_GET['accesscheck'];
}

if (isset($_POST['correo'])) {
  $loginUsername=$_POST['correo'];
  $password=sha1($_POST['password']);
  $MM_fldUserAuthorization = "";
  $MM_redirectLoginSuccess = "access.php";
  $MM_redirectLoginFailed = "index.php";
  $MM_redirecttoReferrer = true;
  mysql_select_db($database_cnnQVS, $cnnQVS);
  $LoginRS__query=sprintf("SELECT correo, password FROM Usuarios WHERE correo=%s AND password=%s",
    GetSQLValueString($loginUsername, "text"), GetSQLValueString($password, "text")); 
   
  $LoginRS = mysql_query($LoginRS__query, $cnnQVS) or die(mysql_error());
  $loginFoundUser = mysql_num_rows($LoginRS);
  if ($loginFoundUser) {
     $loginStrGroup = "";
    
	if (PHP_VERSION >= 5.1) {session_regenerate_id(true);} else {session_regenerate_id();}
    //declare two session variables and assign them
    $_SESSION['MM_Username'] = $loginUsername;
    $_SESSION['MM_UserGroup'] = $loginStrGroup;	      

    if (isset($_SESSION['PrevUrl']) && true) {
      $MM_redirectLoginSuccess = $_SESSION['PrevUrl'];	
    }
    header("Location: " . $MM_redirectLoginSuccess );
  }
  else {
    header("Location: ". $MM_redirectLoginFailed );
  }
}
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Quiero ¡Vivir sano! ::: Curso en línea</title>
<meta  name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, min-scale=1.0"  >

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="library/bootstrap/dist/css/bootstrap.css">
<link rel="stylesheet" href="admin/jquery-ui.min.css" />

<link href="library/style.css" rel="stylesheet" type="text/css">
<script src="SpryAssets/SpryValidationTextField.js" type="text/javascript"></script>
<link href="SpryAssets/SpryValidationTextField.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
<link rel="stylesheet" href="library/dist/css/AdminLTE.min.css">
</head>
<body class="index">
<div id="contenedor">
	<header>
    		<img src="img/logo.png"> <img src="img/cursoEnLinea.png">
    </header>
    <section>
   		<div class="left">
        	<div class="texts">
                <span class="txtH1">UNA AVENTURA<br>
                HACIA LA VIDA REAL</span><br>
                <span class="txtH2">RENUEVA EL DISEÑO DE TU RUTINA<BR>
                DIARIA DE FORMA SALUDABLE</span>
            </div>
        </div>
   		<div class="right">
        	<div class="checkin">
            	<span class="txtH3">¡Continúa la Aventura!</span>
                <form ACTION="<?php echo $loginFormAction; ?>" method="POST" target="_self" id="login">
                  <span id="txtEmail">
                    <!--data-toggle="tooltip"  -->
                  <input name="correo" class="email" size="25" placeholder="EMAIL"   data-placement="top" title="Ingresa tu correo">
              </span>
              <span id="txtPassword">
              <input name="password" type="password" class="password" size="25" placeholder="CONTRASEÑA" data-placement="top" title="ingresa tu clave">
       	  </span><br>
                    <input type="submit" value="ACCEDER"  class="btn btn-magenta acceder">
                </form>
                
        	</div>
            <input name="registrarme" type="button" class="btn btn-verde registrarme center-block " value="REGISTRARME" onClick="javascript:location.href='checkin.php'">
           
                            <a class=" boton facebook btn center-block btn-block btn-social btn-facebook" href="login.php">
                <i class="fa fa-facebook"></i>SESIÓN CON FACEBOOK
              </a>
               <input name="olvide" type="button" class="btn btn-verde olvide center-block " style="    width: 250px;" value="OLVIDÉ MI CONTRASEÑA" onClick="javascript:$('#dialog_Mensaje').dialog('open');">
         
            <!--input name="facebook" type="button" class="boton  " value="SESIÓN CON FACEBOOK" onClick="javascript:location.href=''"!-->
            
        </div>
    </section>
    <footer> 
    </footer>
</div>
<div id="dialog_Mensaje">
      <table width="100%">
          <tr>
              <td id="messageToChangeMensaje"  align="center">Escribe tu correo electrónico:</td>
            </tr>  
             <tr>
              <td align="center">
                  <input type="text" id="correo" value="" style="    width: 100%;" placeholder="Escribe tu correo electrónico" />
                </td>
            </tr>          
            <tr>
              <td align="center">
                  <input type="button" id="dialog_Mensaje_Aceptar" value="&nbsp;&nbsp;&nbsp;&nbsp;Ok&nbsp;&nbsp;&nbsp;&nbsp" class="ui-button" />
                </td>
              
            </tr>
        </table>
  </div>
<div id="msgSpinner" title="Informaci&oacute;n" >
    <div align="center">
      <img src="img/spinner.gif" width="32px" height="32px"/><br/>
      <p id="pMensajeSpinner">Por favor espere..</p>
      <br/>
    </div>
  </div>

<!-- JavaScript Includes -->
<script src="library/plugins/jQuery/jQuery-2.2.0.min.js"></script>
<script src="library/bootstrap/js/transition.js"></script>
<script src="library/bootstrap/js/tooltip.js"></script>
<script src="library/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="admin/jquery-ui.min.js"></script>
<script type="text/javascript">
$("#dialog_Mensaje").dialog({autoOpen: false, modal: true, bgiframe:true, closeOnEscape : false });
var sprytextfield1 = new Spry.Widget.ValidationTextField("txtEmail");
var sprytextfield2 = new Spry.Widget.ValidationTextField("txtPassword");
myMsgSpinner = msgSpinner("Por favor, espere..");
  function msgSpinner(mensaje, accion){
  $('#pMensajeSpinner').text(mensaje);

  if (accion != undefined){
    $('#msgSpinner').dialog({
      autoOpen: false,
      closeOnEscape: false,
      resizable : false,
      height: 180,
      modal: true
    });
  }else{
    $('#msgSpinner').dialog({
      autoOpen: false,
      closeOnEscape: false,
      resizable : false,
      height : 180,
      modal: true
    });
  }
  return $('#msgSpinner').dialog('open');
}
myMsgSpinner.dialog('close');

$(document).on("click","#dialog_Mensaje_Aceptar", function() {
  $("#dialog_Mensaje").dialog("close");
  var correo = $("#correo").val().trim();
  if(correo=="")
  {
    alert("Tienes que escribir un correo electrónico.");
    return;
  }
  var param = {
      servicio : 'login',
      accion : 'mandarCorreo',
      correo : correo
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
        if(resp.success==3)
        {
          alert("El correo que escribiste no existe en nuestra base de datos.");
        }
        if(resp.success==2)
        {
          alert("El correo que escribiste fue registrado en Quiero ¡Vivir Sano! con Facebook, usa Facebook para iniciar sesión.");
        }
        if(resp.success==1)
        {
          alert("Por favor, revisa tu bandeja de correo electrónico, incluyendo el spam o el no deseado.");
        }
        if(resp.success==0)
        {
          alert("Ocurrió un error desconocido.");
        }
      }
    });

   
});
</script>
<!-- JavaScript Test -->
<script>
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
var hola = window.location.href;
if(hola.indexOf("www")!=-1)
{
  window.location="http://quierovivirsano.org/app/";
}
</script>
</body>
</html>