<?php require_once('Connections/cnnQVS.php'); ?>
<?php
//initialize the session
if (!isset($_SESSION)) {
  //commit 2 lineas
  ini_set('session.gc_maxlifetime', 36000);
  session_set_cookie_params(36000);
 
  session_start();
}

// ** Logout the current user. **
$logoutAction = $_SERVER['PHP_SELF']."?doLogout=true";
if ((isset($_SERVER['QUERY_STRING'])) && ($_SERVER['QUERY_STRING'] != "")){
  $logoutAction .="&". htmlentities($_SERVER['QUERY_STRING']);
}

if ((isset($_GET['doLogout'])) &&($_GET['doLogout']=="true")){
  //to fully log out a visitor we need to clear the session varialbles
  $_SESSION['MM_Username'] = NULL;
  $_SESSION['MM_UserGroup'] = NULL;
  $_SESSION['PrevUrl'] = NULL;
  unset($_SESSION['MM_Username']);
  unset($_SESSION['MM_UserGroup']);
  unset($_SESSION['PrevUrl']);
	
  $logoutGoTo = "/app";
  if ($logoutGoTo) {
    header("Location: $logoutGoTo");
    exit;
  }
}
?>
<?php
if (!isset($_SESSION)) {
  session_start();
}
$MM_authorizedUsers = "";
$MM_donotCheckaccess = "true";
if (isset($_GET["fecha"])) {
  $_SESSION["fechaFinal"]=$_GET["fecha"];
}
else
{
  unset($_SESSION['fechaFinal']);
}
// *** Restrict Access To Page: Grant or deny access to this page
function isAuthorized($strUsers, $strGroups, $UserName, $UserGroup) { 
  // For security, start by assuming the visitor is NOT authorized. 
  $isValid = False; 

  // When a visitor has logged into this site, the Session variable MM_Username set equal to their username. 
  // Therefore, we know that a user is NOT logged in if that Session variable is blank. 
  if (!empty($UserName)) { 
    // Besides being logged in, you may restrict access to only certain users based on an ID established when they login. 
    // Parse the strings into arrays. 
    $arrUsers = Explode(",", $strUsers); 
    $arrGroups = Explode(",", $strGroups); 
    if (in_array($UserName, $arrUsers)) { 
      $isValid = true; 
    } 
    // Or, you may restrict access to only certain users based on their username. 
    if (in_array($UserGroup, $arrGroups)) { 
      $isValid = true; 
    } 
    if (($strUsers == "") && true) { 
      $isValid = true; 
    } 
  } 
  return $isValid; 
}

$MM_restrictGoTo = "index.php";
if (!((isset($_SESSION['MM_Username'])) && (isAuthorized("",$MM_authorizedUsers, $_SESSION['MM_Username'], $_SESSION['MM_UserGroup'])))) {   
  $MM_qsChar = "?";
  $MM_referrer = $_SERVER['PHP_SELF'];
  if (strpos($MM_restrictGoTo, "?")) $MM_qsChar = "&";
  if (isset($_SERVER['QUERY_STRING']) && strlen($_SERVER['QUERY_STRING']) > 0) 
  $MM_referrer .= "?" . $_SERVER['QUERY_STRING'];
  $MM_restrictGoTo = $MM_restrictGoTo. $MM_qsChar . "accesscheck=" . urlencode($MM_referrer);
  header("Location: ". $MM_restrictGoTo); 
  exit;
}
?>
<?php
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

$colname_Recordset1 = "-1";
if (isset($_SESSION['MM_Username'])) {
  $colname_Recordset1 = $_SESSION['MM_Username'];
}
mysql_select_db($database_cnnQVS, $cnnQVS);
$query_Recordset1 = sprintf("SELECT * FROM Usuarios WHERE correo = %s", GetSQLValueString($colname_Recordset1, "text"));
$Recordset1 = mysql_query($query_Recordset1, $cnnQVS) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);


//ES PROMOTOR COMMIT
$_SESSION['esPromotor'] = $row_Recordset1['esPromotor'];
?>
<?php 
//DECODIFICAR IMAGEN
$Base64Img = "data:image/jpg;base64,'".$row_Recordset1['picture']."'";
      
list(, $Base64Img) = explode(';', $Base64Img);
list(, $Base64Img) = explode(',', $Base64Img);

$Base64Img = base64_decode($Base64Img);

file_put_contents('profile.jpg', $Base64Img);
?>
<!DOCTYPE HTML>
<html>
<head>
<style type="text/css">

body{
  background-color: #fff;
}

#imagenLlena.wide {
    max-width: 100%;
    max-height: 100%;
    height: auto;
}
#imagenLlena.tall {
    max-height: 100%;
    max-width: 100%;
    width: auto;
}​
</style>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Quiero ¡Vivir Sano!</title>

  <link rel="stylesheet" type="text/css" href="library/tooltipster.css" />

  <script src="library/plugins/jQuery/jQuery-2.2.0.min.js"></script>
<link rel="stylesheet" href="admin/jquery-ui.min.css" />
<script src="admin/jquery-ui.min.js"></script>
 <script type="text/javascript" src="library/jquery.tooltipster.min.js"></script>

  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

  <link rel="stylesheet" href="library/bootstrap/bootstrap-responsive-imc.css">
  <!-- Bootstrap 3.3.6 -->
  <link rel="stylesheet" href="library/bootstrap/dist/css/bootstrap.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
  <!-- jvectormap -->
  <link rel="stylesheet" href="library/plugins/jvectormap/jquery-jvectormap-1.2.2.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="library/dist/css/AdminLTE.css">
  <!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->			
  <link rel="stylesheet" href="library/dist/css/skins/_all-skins.min.css">
  
  <link href="library/content.css" rel="stylesheet" type="text/css">
  <link href="library/content2.css" rel="stylesheet" type="text/css">
  <link href="library/dias.css" rel="stylesheet" type="text/css">
  <link href="library/general.css" rel="stylesheet" type="text/css">
  <script src="library/modernizr.js"></script>



 
</head>

<body class="hold-transition skin-blue sidebar-mini">
<div class="wrapper" style="background-color: #fff;">
  <header class="main-header">

   <a href="#" class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>Q</b>V<b>S</b></span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><img src='img/logo.png' alt='QVS' width="45" /></span>
    </a>

  </header>
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
		<?php 
			if($row_Recordset1['picture']==""){
					echo "<img src='img/logo.png' class='img-circle' alt='Usuario' />";
				}else{
					echo "<img src='profile.jpg' class='img-circle' alt='Usuario' />"; 
			}
		?>
        </div>
        <div class="pull-left info">
          <?php echo $row_Recordset1['nombre']; ?><br>
          <a href="#"><i class="fa fa-circle text-success"></i> 
          <a href="<?php echo $logoutAction ?>">Cerrar Sessión</a></a>
        </div>
      </div>
<!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu">
        <li class="header">NAVEGACION</li>
        
         <li class="active">
          <a href="#" nivel="1" class="bienvenido">
            <i class="fa fa-bars"></i> <span>Bienvenida</span>
          </a> 
        </li>
        
        <li>
          <a id="slideCaractarerizticas"  nivel="2" href="#">
            <i class="fa fa-map-signs"></i> <span>Instrucciones</span><span id="tip" class="tooltip" ></span>
          </a> 
        </li>

        <li>
          <a id="misDatos" tipo="1" nivel="3" href="#">
            <i class="fa fa-pencil-square-o"></i> <span>Informaci&oacute;n personal</span>
          </a> 
        </li>
 
        <li>
          <a id="miIMC" tipo="1" nivel="4" href="#">
            <i class="fa fa-user-md"></i> <span>IMC</span>
          </a> 
        </li>
 
        <li>
          <a id="miEsClinicos" tipo="1" nivel="4" href="#">
            <i class="fa fa-heartbeat"></i> <span>Es. Clínicos</span>
          </a> 
        </li>
 
        <!--li>
          <a href="#">
            <i class="fa fa-pencil-square-o"></i> <span>Mis datos</span> <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a id="misDatos" href="#"><i class="fa fa-tasks"></i> Nuevo registro</a></li>
            <li><a id="historialDeMisDatos" href="#"><i class="fa fa-history"></i> Historial</a></li>
          </ul>
        </li-->

        <!--li>
          <a href="#">
            <i class="fa fa-child"></i> <span>Mis diagnósticos</span> <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a id="miIMC" href="#"><i class="fa fa-user-md"></i> IMC</a></li>
            <li><a id="miEsClinicos" href="#"><i class="fa fa-heartbeat"></i> Es. Clínicos </a></li>
          </ul>
        </li-->
        


        <li>
          <a class="compromiso" nivel="5" href="#">
            <i class="fa fa-hand-paper-o"></i> <span> Compromiso</span>
          </a> 
        </li>
<!-- COMMIT-->
        <li>
          <a href="#" nivel="-1" class="unirmeComunidad">
            <i class="fa fa-users"></i> <span>Unirme a comunidad</span>
          </a> 
        </li>
        <?php
        if($_SESSION["esPromotor"]==1)
        {
           //commit
          echo '<li class="treeview">
            <a href="#" >
              <i class="fa fa-user"></i> <span>Promotor de salud</span>
              <i class="fa fa-angle-left pull-right"></i>
            </a> 
            <ul class="treeview-menu">
              <li><a nivel="-2" class="posicionarMiComunidad" href="#"><i class="fa fa-map-pin"></i> Posicionar mi comunidad</a></li>
              <li><a id="configurarMisHorarios" href="#"><i class="fa fa-calendar"></i> Mis horarios</a></li>
            </ul>
          </li>';
        }
        ?>
        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/1.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>Beber Agua Natural</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="1" class="cuestionario" href="#"><i class="fa fa-pencil"></i> Evaluación</a></li>
            <li><a habito="1" class="quees" href="#"><i class="fa fa-question-circle"></i> ¿Que es?</a></li>
            <li><a habito="1" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="1" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="1" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="1" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="1" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="1" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="1" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="1" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/2.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>Una Actitud Positiva</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="2" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="2" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="2" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="2" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="2" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="2" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="2" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="2" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="2" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="2" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/3.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>El Bien Comer</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="3" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="3" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="3" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="3" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="3" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="3" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="3" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="3" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="3" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="3" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/4.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>Actividad Física</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="4" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="4" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="4" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="4" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="4" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="4" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="4" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="4" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="4" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="4" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/5.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>Un Descanso Adecuado</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="5" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="5" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="5" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="5" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="5" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="5" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="5" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="5" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="5" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="5" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/6.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>Auto-control</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="6" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="6" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="6" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="6" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="6" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="6" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="6" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="6" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="6" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="6" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/7.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>Desayunar + y cenar -</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="7" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="7" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="7" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="7" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="7" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="7" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="7" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="7" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="7" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="7" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>

        <li class="treeview">
          <a href="#">
            <i class="fa " style="background-image: url(img/8.png);width: 20px;height: 20px;background-repeat: no-repeat;background-size: 100% 100%;    margin-left: -3px;margin-right: 4px;"></i>
            <span>Ser Feliz</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="8" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="8" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="8" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="8" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="8" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="8" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="8" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="8" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="8" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="8" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li>
          <a id="misDatos" nivel="6" tipo="2" href="#">
            <i class="fa fa-pencil-square-o"></i> <span>Informaci&oacute;n personal</span>
          </a> 
        </li>
 
        <li>
          <a id="miIMC" tipo="2" nivel="7" href="#">
            <i class="fa fa-user-md"></i> <span>IMC</span>
          </a> 
        </li>
 
        <li>
          <a id="miEsClinicos" tipo="2" nivel="7" href="#">
            <i class="fa fa-heartbeat"></i> <span>Es. Clínicos</span>
          </a> 
        </li>
        <!--li>
          <a id="historialDeLosCompromisos" href="#">
            <i class="fa fa-history"></i> <span> Historial de compromisos</span>
          </a> 
        </li-->
      </ul>
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <!--ul class="sidebar-menu">
        <li class="header">NAVEGACION</li>
        
         <li class="active">
          <a href="#" class="bienvenido">
            <i class="fa fa-bars"></i> <span>Bienvenida</span>
          </a> 
        </li>
        
        <li>
          <a id="slideCaractarerizticas" href="#">
            <i class="fa fa-bars"></i> <span>Características</span>
          </a> 
        </li>
 
        <li>
          <a href="#">
            <i class="fa fa-pencil-square-o"></i> <span>Mis datos</span> <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a id="misDatos" href="#"><i class="fa fa-tasks"></i> Nuevo registro</a></li>
            <li><a id="historialDeMisDatos" href="#"><i class="fa fa-history"></i> Historial</a></li>
          </ul>
        </li>

        <li>
          <a href="#">
            <i class="fa fa-child"></i> <span>Mis diagnósticos</span> <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a id="miIMC" href="#"><i class="fa fa-user-md"></i> IMC</a></li>
            <li><a id="miEsClinicos" href="#"><i class="fa fa-heartbeat"></i> Es. Clínicos </a></li>
          </ul>
        </li>
        


        <li>
          <a class="compromiso" href="#">
            <i class="fa fa-hand-paper-o"></i> <span> Compromiso</span>
          </a> 
        </li>

        <li class="treeview">
          <a href="#">
            <i class="fa fa-pie-chart"></i>
            <span>Beber agua natural</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="1" class="cuestionario" href="#"><i class="fa fa-pencil"></i> Evaluación</a></li>
            <li><a habito="1" class="quees" href="#"><i class="fa fa-question-circle"></i> ¿Que es?</a></li>
            <li><a habito="1" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="1" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="1" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="1" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="1" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="1" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="1" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="1" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-pie-chart"></i>
            <span>Actitud Positiva</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="2" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="2" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="2" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="2" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="2" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="2" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="2" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="2" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="2" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="2" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-pie-chart"></i>
            <span>El bien comer</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="3" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="3" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="3" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="3" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="3" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="3" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="3" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="3" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="3" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="3" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-pie-chart"></i>
            <span>Actividad física</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="4" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="4" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="4" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="4" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="4" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="4" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="4" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="4" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="4" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="4" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-pie-chart"></i>
            <span>Descanso adecuado</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="5" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="5" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="5" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="5" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="5" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="5" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="5" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="5" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="5" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="5" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a href="#">
            <i class="fa fa-pie-chart"></i>
            <span>Auto-control</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li><a habito="6" class="cuestionario" href="#"><i class="fa fa-lock"></i> Evaluación</a></li>
            <li><a habito="6" class="quees" href="#"><i class="fa fa-lock"></i> ¿Que es?</a></li>
            <li><a habito="6" dia="1" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 1</a></li>
            <li><a habito="6" dia="2" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 2</a></li>
            <li><a habito="6" dia="3" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 3</a></li>
            <li><a habito="6" dia="4" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 4</a></li>
            <li><a habito="6" dia="5" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 5</a></li>
            <li><a habito="6" dia="6" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 6</a></li>
            <li><a habito="6" dia="7" class="habitoDia" href="#"><i class="fa fa-lock"></i> Día 7</a></li>
            <li><a habito="6" class="desempenoSemanal" href="#"><i class="fa fa-line-chart"></i> Desempeño semanal</a></li>
          </ul>
        </li>
        <li>
          <a id="historialDeLosCompromisos" href="#">
            <i class="fa fa-history"></i> <span> Historial de compromisos</span>
          </a> 
        </li>
      </ul-->
    </section>
    <!-- /.sidebar -->
  </aside>
  
  <!-- SECCION -->
  <!--<div id="mainContent" class="content-wrapper welcome"> !-->
  <?php
  if(isset($_GET["p"]))
  {
    $sexo=$_GET["p"];

    if($sexo==2)
    {
      
      echo '<div id="mainContent" class="content-wrapper welcomeFemale">';
      
    }else{
      echo '<div id="mainContent" class="content-wrapper welcomeMale">';
    }
  }
  else
  {
    echo '<div id="mainContent" class="content-wrapper welcome">';
  
    //echo '<section style="position: fixed; margin-left:15%; margin-top: 10%;">';
    //echo '<section style="position: fixed;"><div  style="width: calc(100% - 230px); position: fixed; left: 230px;"><div style="text-align: center">';
    //echo '<section style="position: fixed;"><div  style="width: 82%; position: fixed; left: 230px;"><div style="text-align: center">';
echo '<section class="content" style="width: calc(100% - 230px); position: fixed; left: 230px;">
      <div class="row">
        <div class="col-md-12" style="text-align: center">';
       
  
    if($row_Recordset1['gender'] == 'male')
    {
      $icon = "img/male.png";
    }else{
      $icon = "img/female.png";
    }
    echo '<img id="cabeza" src="'.$icon.'" class="center-block " style="margin-top: 10%;margin-bottom: 4%;"/>';

    echo '<div class="FlamaBasic colorNegro  titleWelcome">¡Bienvenido, '.$row_Recordset1['nombre'].'!</div>
            <div class="titleWelcome">
              <p id="cambiaFrase" class="FlamaBasic" style="color: #787272;"></p>
            </div>
            <div>
              <input name="registrarme" nombre="' .$row_Recordset1['nombre'].'"  type="button" class="comenzemosButton btnPurple btnStart center-block" value="COMENZEMOS" >
            </div>
            </div>';
    echo '</section>';
    echo '<script type="text/javascript">
 
 var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == "number" ) {
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  var razon = myHeight*0.0382775119617;
  var cabeza = myHeight*0.13716108453;
  $(".titleWelcome").css("font-size",razon+"px");  
  $(".comenzemosButton").css("font-size",razon+"px");  
  $(".comenzemosButton").css("min-width",(razon*10)+"px");  
  $("#cambiaFrase").css("font-size",razon+"px");  
  $("#cabeza").css("height",cabeza+"px");  


  </script>';
  }
  ?>
   
  </div>
   <!-- / SECCION -->
    <!-- FOOTER -->
  <footer></footer>
    <!-- /FOOTER -->
</div>
<div id="dialog_Mensaje">
      <table width="100%">
          <tr>
              <td id="messageToChangeMensaje"  align="center"> <br /><br /></td>
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
<!-- ./wrapper -->

<!-- jQuery 2.2.0 -->

<!-- Bootstrap 3.3.6 -->
<script src="library/bootstrap/dist/js/bootstrap.js"></script>
<!-- FastClick -->
<script src="library/plugins/fastclick/fastclick.js"></script>
<!-- AdminLTE App -->
<script src="library/dist/js/app.min.js"></script>
<!-- Sparkline -->
<script src="library/plugins/sparkline/jquery.sparkline.min.js"></script>
<!-- jvectormap -->
<script src="library/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="library/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
<!-- SlimScroll 1.3.0 -->
<script src="library/plugins/slimScroll/jquery.slimscroll.min.js"></script>
<!-- ChartJS 1.0.1 -->
<script src="library/plugins/chartjs/Chart.min.js"></script>
<!-- AdminLTE for demo purposes -->
<script src="library/dist/js/demo.js"></script>
<script src="library/jquery.textfill.min.js"></script>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6FFew8Rm3xK1EG9doycwpItqY1RADivA&language=es"
type="text/javascript">
</script>
<div id="nombre" style="display:none"><?php echo $row_Recordset1['nombre']?></div>
<div id="gender" style="display:none"><?php echo $row_Recordset1['gender']?></div>
<script src="app.js"></script>

</body>
</html>
<?php
mysql_free_result($Recordset1);
?>
