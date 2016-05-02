<html>
	<head>
		<title>Promotores de Salud</title>
		<link rel="shortcut icon" href="favicon.ico" type="image/x-ico; charset=binary">
		<link rel="stylesheet" type="text/css" href="css.css" media="screen" />
		<link rel="stylesheet" href="lib/themes/default.css">
    	<link rel="stylesheet" href="lib/themes/default.date.css">
   
		<script src="jquery-2.1.1.min.js"></script>
		
	</head>
	<body>
		<img src="banner2.jpg" style="width:100%;"/>
		<center>
			
		
		<form class="basic-grey" method="POST" action="../qvs.php">
			<h1>PROMOTORES DE SALUD<span></span></h1>

			<br>
		<hr>
		<br>

		
<input type="hidden" name="servicio" value="login"/>
<input type="hidden" name="accion" value="acccess"/>
<?php
if(isset($_GET["error"]))
{
	echo "NO ES LA PALABRA SECRETA";
}
?>
		<label><span>Escribe la palabra secreta:</span></label><input type="password" maxlength="250" name="password" id="password" />	<br><br>
		<label><span>&nbsp;</span><input type="submit" id="entrar" class="button" style="font-size:17px;" value="Inscribirse"></label>
		</form>
		</center>
		<div class="modal"><!-- Place at bottom of page --></div>
		<script src="lib/picker.js"></script>
    	<script src="lib/picker.date.js"></script>
		<!--script src="app.js"></script-->
	</body>

</html>