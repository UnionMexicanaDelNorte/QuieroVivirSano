<?php
	ini_set("display_errors", 1);	
	header("Content-Type: text/html; charset=ISO_8859-1");
	if(!isset($_SESSION))
	{
		ini_set('session.gc_maxlifetime', 36000);
		session_set_cookie_params(36000);
		session_start();  
	}
	if (!isset($_SESSION['idPersona']))
	{
		header('Location: index.php?error=111');
		exit();
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Promotores de Salud</title>
		<meta charset="utf-8">
    	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link rel="shortcut icon" href="favicon.ico" type="image/x-ico; charset=binary">
		<link rel="stylesheet" type="text/css" href="css.css" media="screen" />
		<link rel="stylesheet" href="lib/themes/default.css">
    	<link rel="stylesheet" href="lib/themes/default.date.css">
   		<link rel="stylesheet" href="jquery-ui.min.css" />
   
		<script src="jquery-2.1.1.min.js"></script>
		<script src="jquery-ui.min.js"></script>
	</head>
	<body>
		<img src="banner2.jpg" style="width:100%;"/>
		<center>
			
		
		<form class="basic-grey" method="POST" action="../qvs.php">
			<h1>PROMOTORES DE SALUD<span> Administrar promotores de salud</span></h1>

			<br>
		<hr>
		<br>
<input type="hidden"  class="form-control" id="referrer_id"/>
		<label><span>Nombre o correo de la persona:</span></label><input type="text" maxlength="250" name="nombre" id="nombre" />	<br><br>
		<label><span>Campo:</span></label>
		<select id="esPromotor"/>
			<option value="0">No es promotor de salud</option>
			<option value="1">Si es promotor de salud</option>
		</select>	<br><br>
		<label><span>&nbsp;</span><input type="buttton" id="guardarCambios" class="button" style="font-size:17px;" value="Guardar  cambios"></label>
		<br><br>
		<label>Cuando indicas que una persona es promotora de salud, le llega un correo indicandole ese nombramiento. De la misma forma, cuando indicas que esa persona ya no es promotora de salud, le llegar&aacute; un correo con esa notificaci&oacute;n.</label>
		<br><br>
		</form>
		</center>
		<div class="modal"><!-- Place at bottom of page --></div>
		<script src="lib/picker.js"></script>
    	<script src="lib/picker.date.js"></script>
		<script src="app.js"></script>
	</body>

</html>