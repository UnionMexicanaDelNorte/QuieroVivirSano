<?php
	ini_set("display_errors", 0);	
	header("Content-Type: text/html; charset=ISO_8859-1");
	header("Content-type: text/javascript; charset=iso-8859-1");
	$variables = array_keys($HTTP_POST_VARS); 
    $valores = array_values($HTTP_POST_VARS); 
date_default_timezone_set('America/Monterrey');	
							
							     
    for($a=0;$a<count($valores);$a++){ 
        $valores[$a] = utf8_decode($valores[$a]); 
    } 

    for($a=0;$a<count($valores);$a++){ 
        $cadena = $variables[$a]; 
        $$cadena = $valores[$a]; 
    }  
	
	
if(!isset($_SESSION))
    {
       session_start();  
    }
function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}
class connectionMinisterial {
	
	public $conn;		//Variable publica donde se guardara el objeto de conexion
	public $flagConn; 	//Boolean
	
	private $username;
	private $password;
	private $hostname;
	private $database;
	
	public function __construct(){
		
		$this->username = "";
		$this->password = "";
		$this->hostname = "";
		$this->database = "";
	
		$this->conn = mysql_pconnect($this->hostname,$this->username,$this->password) or die ("Error de Logeo");
			
		if ($this->conn){
			$this->flagconn = true;
		}else{
			$this->flagconn = false;
		}

		$data = mysql_select_db($this->database,$this->conn) or die ("Error de seleccion de base de datos");
	}
	
	public function __destruct(){
		mysql_close($this->conn);
	}
}
	$recordsetMinisterial = new connectionMinisterial();
	
	$servicio = $_POST['servicio'];
	$accion = $_POST['accion'];

	if(isset($_GET['servicio']))
	{
		$servicio = $_GET['servicio'];
	}
	if(isset($_GET['accion']))
	{
		$accion = $_GET['accion'];
	}
function mandaNotificacionAlCelular($tipo,$token,$mensaje)
{
	if($tipo==1)
	{
		$token = str_replace("<", "", $token);
		$token = str_replace(">", "", $token);
		$token = str_replace(" ", "", $token);
		$passphrase = 'asdwer';
		//$mensaje = "hola, este es un mensaje corto";
		$url="";
		//echo $tipo." ".$token." ".$mensaje;
		$ctx = stream_context_create();
		stream_context_set_option($ctx, 'ssl', 'local_cert', 'devpush.pem');
		stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);
		$fp = stream_socket_client('ssl://gateway.sandbox.push.apple.com:2195', $err,$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
		if (!$fp)
  			exit("Failed to connect: $err $errstr" . PHP_EOL);
		//echo 'Connected to APNS' . PHP_EOL;
		// Create the payload body
		$body['aps'] = array(
		  'alert' => $mensaje,
		  'sound' => 'default',
		  'link_url' => $url,
		  'category' => "NEWS_CATEGORY",
		  );
		$payload = json_encode($body);
		$msg = chr(0) . pack('n', 32) . pack('H*', $token) . pack('n', strlen($payload)) . $payload;
		$result = fwrite($fp, $msg, strlen($msg));
		/*if (!$result)
  			echo 'Message not delivered' . PHP_EOL;
		else
		  echo 'Message successfully delivered' . PHP_EOL;
*/
		fclose($fp);
	}
}	
switch($servicio)
	{
		case 'login':
				switch($accion)
				{
					case 'registrarse':
						$correo = $_POST["correo"];
						$nombre = utf8_decode($_POST["nombre"]);
						$edad = $_POST["edad"];
						$ciudad = utf8_decode($_POST["ciudad"]);
						$religion = utf8_decode($_POST["religion"]);
						$pais = utf8_decode($_POST["pais"]);
						$pass = sha1($_POST["pass"]);
						$gender = $_POST["gender"];
						//revisar si existe el correo
						$sql1=("SELECT correo FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								echo '{ "success" : 2 }';
								exit();
							}
						}
						$sql=("INSERT INTO Usuarios (correo, nombre, age, ciudad,religion, pais, password, gender,reto, esPromotor, fechaUltimoReto) VALUES ('".$correo."','".$nombre."',".$edad.", '".$ciudad."', '".$religion."', '".$pais."', '".$pass."', '".$gender."',1,0,20160101)");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit();
					break;
					case 'cambiarContra':
						if(!isset($_SESSION['c']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						if(!isset($_SESSION['h']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo=$_SESSION["h"];
						$password=$_SESSION["c"];
						$passwordNuevo=sha1($_POST["pass"]);
						$sql1=("SELECT password FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								if($row1["password"]==$password)
								{
									$sql=("UPDATE Usuarios SET password = '".$passwordNuevo."' WHERE correo = '".$correo."'");
									if($query = mysql_query($sql))
									{
										echo '{ "success" : 1 }';
										exit();
									}
								}
								else
								{
									echo '{ "success" : 2 }';
									exit();
								}
							}
						}
						echo '{ "success" : 0 }';
						exit();
					break;
					case 'mandarCorreo':
						$correo = $_POST['correo'];
						$sql1=("SELECT password FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$password = $row1["password"];
								if($password=="")
								{
									echo '{ "success" : 2 }';//password con facebook
									exit();			
								}
								else
								{
									require  'admin/PHPMailerAutoload.php';
									$mail = new PHPMailer();
									$mail->isSMTP();
									$mail->SMTPDebug = 0;
									$mail->Debugoutput = 'html';
									$mail->Host = 'smtp.gmail.com';								
									//$mail->Host = 'rply-6pdh.accessdomain.com';
									$mail->Port = 587;
									$mail->SMTPSecure = 'tls';
									$mail->SMTPAuth = true;
									//$mail->Username = "almacen@unionnorte.org";
									$mail->Username = "f.pecina@unav.edu.mx";
									$mail->Password = "thanks_God1844";
									//$mail->setFrom('almacen@unionnorte.org', 'Almacen');
									$mail->setFrom('f.pecina@unav.edu.mx', 'Quiero Vivir Sano');
									$mail->addReplyTo('f.pecina@unav.edu.mx', 'Quiero Vivir Sano');
									$mail->addBCC('f.pecina@unav.edu.mx', 'Hola');
									$mail->addAddress($correo, 'Quiero Vivir Sano');
									$titulo = 'Generar nueva contrasena para Quiero Vivir Sano!';
									$cadLink = '<div>Por favor, dale click al siguiente enlace para generar una nueva contrase&ntilde;a: <a href="http://quierovivirsano.org/app/recuperarContrasena.php?c='.$password.'&h='.$correo.'">DAR CLICK AQUI</a></div>';
									$mail->Subject = $titulo;
									$mail->msgHTML($cadLink);
									if (!$mail->send()) {
									   echo '{ "success" : -1 , "error" : '.$mail->ErrorInfo.'}';
									} else {
										echo '{ "success" : 1, "sql" : "'.$sql1.'", "p" : "'.$password.'" }';
										exit(0);
									}	
								}
							}
							else
							{
								echo '{ "success" : 3 }';//no existe usuario
								exit();			
							}
						}
						echo '{ "success" : 0 }';
						exit();
					break;
					case 'guardarCambios':
						if(!isset($_SESSION['idPersona']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_POST['correo'];
						$valor = $_POST['valor'];
						$esPromotor = 0;
						$tipoDispositivo = 0;
						$token = "";
						$sql1=("SELECT esPromotor, 	tipoDispositivo, token FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$tipoDispositivo = $row1["tipoDispositivo"];
								$token = $row1["token"];
								$esPromotor = $row1["esPromotor"];
							}
						}
						if($esPromotor==$valor)//no changes
						{
							echo '{ "success" : 2 }';
							exit();
						}
						$sql1=("UPDATE Usuarios SET esPromotor = ".$valor." WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							require  'admin/PHPMailerAutoload.php';
							$mail = new PHPMailer();
							$mail->isSMTP();
							$mail->SMTPDebug = 0;
							$mail->Debugoutput = 'html';
							$mail->Host = 'smtp.gmail.com';								
							//$mail->Host = 'rply-6pdh.accessdomain.com';
							$mail->Port = 587;
							$mail->SMTPSecure = 'tls';
							$mail->SMTPAuth = true;
							//$mail->Username = "almacen@unionnorte.org";
							$mail->Username = "f.pecina@unav.edu.mx";
							$mail->Password = "thanks_God1844";
							//$mail->setFrom('almacen@unionnorte.org', 'Almacen');
							$mail->setFrom('f.pecina@unav.edu.mx', 'Quiero Vivir Sano');
							$mail->addReplyTo('f.pecina@unav.edu.mx', 'Quiero Vivir Sano');
							$mail->addBCC('f.pecina@unav.edu.mx', 'Hola');
							$mail->addAddress($correo, 'Promotor de salud');
							$titulo = 'Hola, has sido nombrado promotor de salud QVS.';
							$cadLink = '<div>¡Felicidades!, has sido nombrado <b>Promotor de Salud QVS</b>, por favor vuelve a iniciar sesi&oacute;n en la aplicaci&oacute;n para indicar tu lugar de reuni&oacute;n y los horarios de tu comunidad Quiero Vivir Sano.</div>';							
							$mensaje = '¡Felicidades!, has sido nombrado: Promotor de Salud QVS, por favor vuelve a iniciar sesión en la aplicación para indicar tu lugar de reunión y los horarios de tu comunidad Quiero Vivir Sano.';
							if($valor==0)//ya no es promotor
							{
								$titulo = 'Hola, ha sido dado de baja de la lista de promotores de salud QVS.';
								$cadLink = '<div>¡Hola!, has sido dado de baja como <b>Promotor de Salud QVS</b>, si crees que esto fue un error, favor de notificarlo al campo local.</div>';							
								$mensaje = '¡Hola!, has sido dado de baja como: Promotor de Salud QVS, si crees que esto fue un error, favor de notificarlo al campo local.';
							}
							if($tipoDispositivo!=0)//tiene registrado celular
							{
								mandaNotificacionAlCelular($tipoDispositivo,$token,$mensaje);	
							}
							$mail->Subject = $titulo;
							$mail->msgHTML($cadLink);
							if (!$mail->send()) {
							   echo '{ "success" : -1 , "error" : '.$mail->ErrorInfo.'}';
							} else {
								echo '{ "success" : 1 }';
								exit(0);
							}	
						}
						echo '{ "success" : 0 }';
						exit();
					break;
					case 'checarSiEsPromotor':
						if(!isset($_SESSION['idPersona']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_POST['correo'];
						$sql1=("SELECT esPromotor FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								echo '{ "success" : 1, "esPromotor" : '.$row1["esPromotor"].' }';
								exit();				
							}
						}
						echo '{ "success" : 0 }';
						exit();
					break;
					case 'dameUsuarios':
						if(!isset($_SESSION['idPersona']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$promotores = array();
						$sql1=("SELECT correo, nombre, esPromotor FROM Usuarios order by nombre asc");
						//echo "0";
						if($query1 = mysql_query($sql1))
						{
						//	echo "1";
							while($row1=mysql_fetch_array($query1))
							{
								//$row1["nombre"]=utf8_encode($row1["nombre"]);
								array_push($promotores, $row1);							
						//		echo "2";
							}
						//	echo "3";
							echo '{ "success" : 1, "promotores" : '.json_encode(utf8ize($promotores)).' }';
							exit();
						}
						echo '{ "success" : 0 }';
						exit();
					break;
					case 'acccess':
						$password = sha1($_POST['password']);
						//hardcode maximus
						if($password=="d1733d6b89e91dacf0a6cfa7b20cffd7325b7fff")//Promotores_7!
						{
							if(!isset($_SESSION))
						    {
						    	ini_set('session.gc_maxlifetime', 36000);
								session_set_cookie_params(36000);
						       	session_start();  
						    }
							$_SESSION["idPersona"]=1;
							header('Location: admin/admin.php');
							exit(0);
						}
						else
						{
							header('Location: admin/index.php?error=564');
							exit(0);
						}
					break;
				}
		break;
		case 'app':
				switch($accion)
				{
					case 'getDatosDeLaComunidad':
						$info = array();
						$correo = $_POST['correo'];
						$first=1;
						//$sql1=("SELECT u.idFacebook, u.nombre, u.picture, h.horario, h.descripcion FROM Usuarios u INNER JOIN Horarios h on h.correo = u.correo WHERE u.correo= '".$correo."'");
						$sql1=("SELECT idFacebook, nombre, picture  FROM Usuarios WHERE correo= '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								//$row1["nombre"] = utf8_encode($row1["nombre"]);
								$row1["horarios"]=array();
								array_push($info, $row1);
								$sql2=("SELECT horario, descripcion  FROM Horarios WHERE correo= '".$correo."'");
								if($query2 = mysql_query($sql2))
								{
									while($row2=mysql_fetch_array($query2))
									{
										//$row2["descripcion"]=utf8_encode($row2["descripcion"]);
										//$row2["horario"]=utf8_encode($row2["horario"]);
										array_push($info[0]["horarios"],$row2);
									}
									echo '{ "success" : 1, "info" : '.json_encode(utf8ize($info)).' }';
									exit(0);
								}
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getAllCiudadesByCiudad':
						$ciudades = array();
						$pais = $_POST["pais"];
						$sql1=("SELECT CiudadNombre FROM ciudad WHERE PaisCodigo = '".$pais."' order by CiudadNombre asc");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								//$row1["CiudadNombre"] = utf8_encode($row1["nombre"]);
								array_push($ciudades, $row1);
							}
							echo '{ "success" : 1, "ciudades" : '.json_encode(utf8ize($ciudades)).' }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getAllPaises':
						$sql1=("SELECT iso3, nombre FROM paises order by nombre asc");
						$p = array();
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								//$row1["nombre"] = utf8_encode($row1["nombre"]);
								//$row1["iso3"] = utf8_encode($row1["iso3"]);
								//echo $row1["nombre"]." ".$row1["iso3"];
								array_push($p, $row1);
							}
							//echo $p[0]["nombre"];
							//exit(0);
							echo '{ "success" : 1, "paises" : '.json_encode(utf8ize($p)).' }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getAllGPS':
						$gps = array();
						$sql1=("SELECT c.latitud, c.longitud, c.correo, u.nombre FROM Comunidades c INNER JOIN Usuarios u on u.correo = c.correo");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								$row1["nombre"] = utf8_encode($row1["nombre"]);
								array_push($gps, $row1);
							}
							echo '{ "success" : 1, "gps" : '.json_encode($gps).' }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'historialDeMisDatos':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$datos = array();
						$sql1=("SELECT u.gender, i.cm, i.kg, i.cintura, i.timestamp, i.presion, i.colesterol, i.glucosa, i.trigliceridos, i.ldl, i.hdl, i.presionhg FROM imc i INNER JOIN Usuarios u on u.correo = i.correo WHERE i.correo = '".$correo."' order by i.timestamp desc");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								array_push($datos, $row1);
							}
							echo '{ "success" : 1, "datos" : '.json_encode($datos).' }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit();
					break;
					case 'diagnosticoIMCWeb':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$sql1=("SELECT u.gender,h.cm,h.kg,h.cintura, h.presion, h.presionhg, h.colesterol, h.glucosa, h.trigliceridos, h.ldl, h.hdl FROM Usuarios u INNER JOIN imc h on h.correo = u.correo WHERE u.correo = '".$correo."' order by h.timestamp desc LIMIT 1");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								echo '{ "success" : 1 , "trigliceridos" : '.$row1["trigliceridos"].' , "glucosa" : '.$row1["glucosa"].' , "colesterol" : '.$row1["colesterol"].' , "presion" : '.$row1["presion"].' , "presionhg" : '.$row1["presionhg"].' , "hdl" : '.$row1["hdl"].' , "ldl" : '.$row1["ldl"].'  ,"cintura" : '.$row1["cintura"].',"kg" : '.$row1["kg"].',"cm" : '.$row1["cm"].' , "gender" : "'.$row1["gender"].'" }';
								exit();
							}
							else
							{
								echo '{ "success" : 2 }';
								exit();
							}
						}
						echo '{ "success" : 0  }';
						exit();
					break;
					case 'siguientePregunta':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$habito = $_POST['habito'];
						$preguntaRequerida = $_POST['preguntaRequerida'];
						$mxaimoDePreguntas = 0;
						$sql1=("SELECT MAX(consecutivo) as maximo FROM Cuestionario WHERE habito = ".$habito);
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$mxaimoDePreguntas = $row1["maximo"];
							}
						}
						if($preguntaRequerida>$mxaimoDePreguntas)
						{
							echo '{ "success" : 2, "limite" : '.$mxaimoDePreguntas.' }';//ya acabaste mano
							exit();
						}
						$sql1=("SELECT pregunta, ascendente FROM Cuestionario WHERE habito = ".$habito." AND consecutivo = ".$preguntaRequerida);
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$row1["pregunta"] = $row1["pregunta"];
								echo '{ "success" : 1, "pregunta" : "'.$row1["pregunta"].'", "ascendente" : '.$row1["ascendente"].' }';
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'inscribirteAComunidad':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correoAInscribir = $_SESSION['MM_Username'];
						$correoPromotor = $_POST['correo'];
						$sql2=("SELECT i.correoJefe, u.nombre FROM IntegrantesDeComunidades i INNER JOIN Usuarios u on u.correo = i.correoJefe  WHERE i.correoIntegrante = '".$correoAInscribir."'");
						if($query2 = mysql_query($sql2))
						{
							if($row2=mysql_fetch_array($query2))
							{
								if($row2["correoJefe"]==$correoPromotor)
								{
									echo '{ "success" : 3 }';
									exit(0);
								}
								$sql1=("UPDATE IntegrantesDeComunidades SET correoJefe = '".$correoPromotor."' WHERE correoIntegrante = '".$correoAInscribir."'");
								if($query1 = mysql_query($sql1))
								{
									$row2["nombre"] = utf8_encode($row2["nombre"]);
									echo '{ "success" : 2, "nombre" : "'.$row2["nombre"].'" }';
									exit(0);
								}
							}
							else
							{
								$sql=("INSERT INTO IntegrantesDeComunidades (correoJefe, correoIntegrante) VALUES ('".$correoPromotor."','".$correoAInscribir."')");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1 }';
									exit(0);
								}
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'insertarCompromiso':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$sql2=("SELECT kg FROM imc WHERE correo = '".$correo."' LIMIT 1");
						if($query2 = mysql_query($sql2))
						{
							if($row2=mysql_fetch_array($query2))
							{
								$sql1=("SELECT fechaInicio FROM intentosInicio WHERE compromisoNoTerminado = 0 AND compromisoTerminado = 0 AND correo = '".$correo."'");
								if($query1 = mysql_query($sql1))
								{
									if($row1=mysql_fetch_array($query1))
									{
										echo '{ "success" : 2, "fecha" : "'.$fechaInicio.'" }';//ya tienes un compromiso
										exit();
									}
									else
									{
										$timestamp = time();
										$fechaInicio = date('Ymd', $timestamp);
										$sql=("INSERT INTO intentosInicio (correo, timestamp,fechaInicio) VALUES ('".$correo."',".$timestamp.",".$fechaInicio.")");
										if($query = mysql_query($sql))
										{
											echo '{ "success" : 1 }';
											exit(0);
										}
									}
								}
							}
							else
							{
								echo '{ "success" : 3 }';//primero registra tu masa corporal
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'desempenoSemanal':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$habito = $_POST['habito'];
						//seleccionar timestampInicio 
						//avanzeDiario con maximo
						//poner array
						$todo = array();
						$sql1=("SELECT fechaInicio, timestamp  FROM intentosInicio WHERE compromisoNoTerminado = 0 AND compromisoTerminado = 0 AND correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$fechaInicio="".$row1["fechaInicio"];
								$timestampDeInicio=$row1["timestamp"];
								$sql=("SELECT a.valorObtenido, m.maximo, m.habito, m.diaConsecutivo FROM avanzeDiario a INNER JOIN maximoPorDia m on (m.habito=a.habito AND m.diaConsecutivo=a.diaConsecutivo) WHERE a.timestampDeInicio = ".$timestampDeInicio." AND a.correo = '".$correo."'");
								if($query = mysql_query($sql))
								{
									while($row=mysql_fetch_array($query))
									{
										array_push($todo, $row);
									}
									$maximo=0;
									$total=0;
									$sql2=("SELECT SUM(maximo) as maximo FROM maximoPorDia WHERE habito = ".$habito);
									if($query2 = mysql_query($sql2))
									{
										if($row2=mysql_fetch_array($query2))
										{
											$maximo = $row2["maximo"];
										}
									}
									$sql2=("SELECT SUM(valorObtenido) as total FROM avanzeDiario WHERE timestampDeInicio = ".$timestampDeInicio." AND habito = ".$habito." AND correo = '".$correo."'");
									if($query2 = mysql_query($sql2))
									{
										if($row2=mysql_fetch_array($query2))
										{
											$total = $row2["total"];
										}
									}
									echo '{ "success" : 1 , "total" : '.$total.', "maximo" : '.$maximo.', "todo" : '.json_encode($todo).' }';
									exit(0);
								}
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'yaHizeUnaActividad':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$habito = intval($_POST['habito']);
						$diaConsecutivo = intval($_POST['diaConsecutivo']);
						$timestampDeInicio = $_POST['timestampDeInicio'];
						$valorObtenido = $_POST['valorObtenido'];
						$timestamp = time();
						$dia = date('Ymd', $timestamp);
						//borrar hardcode {
						if(isset($_SESSION["fechaFinal"]))
						{
							$dia = $_SESSION["fechaFinal"];
						}
						//borrar hardcode }
						//verificar que ya no este ese día
						$sql1=("SELECT dia FROM avanzeDiario WHERE timestampDeInicio = ".$timestampDeInicio." AND correo = '".$correo."' AND dia = ".$dia." order by dia desc");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								echo '{ "success" : 3 }';
								exit(0);
							}
						}
						//si es el primer dia, vamonos recio
						if($habito==1 && $diaConsecutivo==1)
						{
							$sql=("INSERT INTO avanzeDiario (correo, dia, habito, diaConsecutivo, valorObtenido, timestampDeInicio) VALUES ('".$correo."',".$dia.",".$habito.", ".$diaConsecutivo.",".$valorObtenido.",".$timestampDeInicio.")");
							if($query = mysql_query($sql))
							{
								echo '{ "success" : 1 }';
								exit(0);
							}
						}
						//verificar que ya haya pasado un dia
						$sql1=("SELECT dia FROM avanzeDiario WHERE timestampDeInicio = ".$timestampDeInicio." AND correo = '".$correo."' order by dia desc");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$diaUltimo = $row1["dia"];	
								if($dia>$diaUltimo)
								{
									$sql=("INSERT INTO avanzeDiario (correo, dia, habito, diaConsecutivo, valorObtenido, timestampDeInicio) VALUES ('".$correo."',".$dia.",".$habito.", ".$diaConsecutivo.",".$valorObtenido.",".$timestampDeInicio.")");
									if($query = mysql_query($sql))
									{
										echo '{ "success" : 1, "diaUltimo" : '.$diaUltimo.' }';
										exit(0);
									}
								}
								else
								{
									echo '{ "success" : 2, "fecha" : '.$diaUltimo.' }';//debes de esperar un dia!
									exit(0);
								}
							}
							else
							{
								echo '{ "success" : 2, "fecha" : '.$diaUltimo.' }';//debes de esperar un dia!
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'guardaResultadoEvaluacion':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$habito = $_POST['habito'];
						$resultado = $_POST['resultado'];
						$sql=("INSERT INTO evaluacion (correo, habito, resultado,  timestamp) VALUES ('".$correo."',".$habito.", ".$resultado.",".time().")");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'cargaHabitoDiaConsecutivo':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$habito = $_POST['habito'];
						$diaConsecutivo = $_POST['diaConsecutivo'];
						$si=1;//contestar
						$fechaActual = date('Ymd', time());
						$fechaActual = "".$fechaActual;
						//borrar hardcode
						if(isset($_SESSION["fechaFinal"]))
						{
							$fechaActual = $_SESSION["fechaFinal"];	
						}



						$diaUltimo=$fechaActual;
						$sql1=("SELECT dia FROM avanzeDiario WHERE habito = ".$habito." AND diaConsecutivo = ".$diaConsecutivo." AND correo = '".$correo."' order by dia asc");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								$diaUltimo=$row1["dia"];
								$si=0;//ver
							}
						}
						if($fechaActual!=$diaUltimo)
						{
							//echo $fechaActual.".".$diaUltimo;
							$si=1;//works in reinicio
						}
						$sql1=("SELECT maximo, primerasPalabras, link, tituloArticulo FROM maximoPorDia WHERE habito = ".$habito." AND diaConsecutivo = ".$diaConsecutivo);
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$sql2=("SELECT kg FROM imc WHERE correo = '".$correo."' order by timestamp desc LIMIT 1");
								if($query2 = mysql_query($sql2))
								{
									if($row2=mysql_fetch_array($query2))
									{
										echo '{ "success" : 1,  "si" : '.$si.', "kg" : '.$row2["kg"].' , "tituloArticulo" : "'.$row1["tituloArticulo"].'", "link" : "'.$row1["link"].'", "primerasPalabras" : "'.$row1["primerasPalabras"].'", "maximo" : '.$row1["maximo"].' }';
										exit(0);
									}
								}
							}
							else
							{
								echo '{ "success" : 2 }';//NO CENASTE HOY, NO NO NO NO CENASTE HOY, ESTAS A DIETA
								exit();
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'obtenFraseAleatoria':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$frases = array();
						$sql1=("SELECT frase FROM frases order by idFrase asc");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								array_push($frases, $row1["frase"]);
							}
							$numero = array_rand($frases,1);
							echo '{ "success" : 1, "frase" : "'.$frases[$numero].'" }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'verHistorialDeCompromisos':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$historial = array();
						/*SELECT i.timestamp, i.fechaInicio, i.compromisoNoTerminado, i.compromisoNoTerminado, a.dia, a.valorObtenido, a.habito, a.diaConsecutivo, m.maximo FROM intentosInicio i
						INNER JOIN avanzeDiario a on a.timestampDeInicio = i.timestamp
						INNER JOIN maximoPorDia m on (m.habito = a.habito AND m.diaConsecutivo = a.diaConsecutivo)
						 WHERE i.correo = 'alonsopf@hotmail.com' order by i.fechaInicio desc
						$sql2=("SELECT kg FROM imc WHERE correo = '".$correo."' order by timestamp desc LIMIT 1");
						if($query2 = mysql_query($sql2))
						{
							if($row2=mysql_fetch_array($query2))
							{
							}
						}*/
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'borraIMCRegistro':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$time = $_POST['time'];
						$sql1=("DELETE FROM imc WHERE correo = '".$correo."' AND timestamp = ".$time);
						if($query1 = mysql_query($sql1))
						{
							echo '{ "success" : 1 }';
							exit(0);
						} 
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'subeDeNivel':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$nivel = intval($_POST['nivel'])+1;
						$nivelActual=1;
						$sql1=("SELECT nivel FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$nivelActual=intval($row1["nivel"]);
							}
						}
						if($nivelActual>=$nivel)
						{
							echo '{ "success" : 1 }';
							exit(0);							
						}
						else
						{
							$sql1=("UPDATE Usuarios SET nivel = ".$nivel." WHERE correo = '".$correo."'");
							if($query1 = mysql_query($sql1))
							{
								echo '{ "success" : 1 }';
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'verQueOndaConLosDias':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						//este metodo se va a utilizar cuando la persona entre al curso, y tambien cuando le de click a alguno de los dias
						//servira para indicar el avanze del curso, si hay que volver a empezar, y para cargar el diaActividad o no
						$correo = $_SESSION['MM_Username'];
						//primero tengo que checar si hay un compromiso activo
						// regresare el habito, diaConsecutivo en el que va actualmente
						// regresare si hizo el habito-dia o no, para poner la tachita o palomita
						// validaré las cosas
						// en la respuesta.. pondré los iconitos
						// leeré habito y dia requerido, para mostrar lo que pide, si ya lo hizo, si no lo puede ver, si es el dia actual!
						$fechaInicio=0;
						$timestamp = time();
						$habitoREQUERIDO = $_POST['habito'];
						$diaConsecutivohabitoREQUERIDO = $_POST['diaConsecutivo'];
						$fechaFinal = date('Ymd', $timestamp);
						
						$fechaFinal = "".$fechaFinal;
						//borrar hardcode {
						if(isset($_SESSION["fechaFinal"]))
						{
							$fechaFinal = $_SESSION["fechaFinal"];	
						}
						//borrar hardcode }
						$ano = substr($fechaFinal,0,4);
						$mes = substr($fechaFinal,4,2);
						$dia = substr($fechaFinal,6,2);
						$date2=date_create($ano."-".$mes."-".$dia);
						$nivel=1;
						$timestampDeInicio=0;	
						$diasConIconoPalomita=array();
						$limiteDeDiasGlobales=8;
						$limiteDeDiasSemanales=3;//2
						$limiteDeDiasConsecutivosSemanales=3;//2
						$limiteDeDiasConsecutivosGlobales=5;
						
						$habitoAnterior=1;
						$habitoRealizado = 1;
						$diaConsecutivoRealizado=0;
						$sql1=("SELECT nivel FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$nivel=$row1["nivel"];
							}
						}
						$sql1=("SELECT fechaInicio, timestamp FROM intentosInicio WHERE compromisoNoTerminado = 0 AND compromisoTerminado = 0 AND correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$fechaInicio="".$row1["fechaInicio"];
								$timestampDeInicio=$row1["timestamp"];
								$ano = substr($fechaInicio,0,4);
								$mes = substr($fechaInicio,4,2);
								$dia = substr($fechaInicio,6,2);
								$date1=date_create($ano."-".$mes."-".$dia);
								$habito=1;
								$diaConsecutivo=1;
								$numeroDeDiasNoHechosGlobales=0;
								$numeroDeDiasConsecutivosNoHechosGlobales=0;
								$numeroDeDiasNoHechosSemanales=0;
								$numeroDeDiasConsecutivosNoHechosSemanales=0;
								$hizoElDia=0;
								$diasNaturales=0;
								$esConsecutivo=0;//0 no, 1 si
								//si encuentro en la base de datos un reinicio de habito, debo de poner dia = 1!!
								$bandera=1;
								$fechaActual="".$ano.$mes.$dia;


							

								$diff=date_diff($date1,$date2);
								$diff= intval( $diff->format("%a"));
								if($diff>0)
								{
									$diaHecho = array();
									$diaHecho["habito"]=1;
									$diaHecho["diaConsecutivo"]=1;
									array_push($diasConIconoPalomita, $diaHecho);
								}
								//bandera se va a desactivar cuando la fechaActual sea la fechaFinal!
								while($bandera==1)
								{
									$diasNaturales=$diasNaturales+1;
									//yo aqui checo si hay algo por los dias naturales
									$sql=("SELECT a.valorObtenido, a.diaConsecutivo, a.habito  FROM avanzeDiario a  WHERE a.timestampDeInicio = ".$timestampDeInicio." AND a.correo = '".$correo."' AND a.dia = ".$fechaActual);
									if($query = mysql_query($sql))
									{
										if($row=mysql_fetch_array($query))//si ya hizo la actividad de este dia, desbloquea el proximo
										{
											$esConsecutivo=0;
											
											$habitoRealizado = intval($row["habito"]);
											$diaConsecutivoRealizado = intval($row["diaConsecutivo"]);
											$diaHecho = array();

											$habitoPrimo = intval($habitoRealizado);
										    $diaPrimo = intval($diaConsecutivoRealizado);
										    if($diaPrimo<7)
										    {
										      $diaPrimo=$diaPrimo+1;
										    }
										    else
										    {
										      if($habitoPrimo<8)
										      {
										      	$habitoPrimo=$habitoPrimo+1;
										        $diaPrimo=1;
										      }
										    }
										    $hizoElDia=1;
											//n+1 SIEMPRE Y CUADO HAYA PASADO UN DIA!
										   /* if($diaConsecutivoRealizado<6)
										    {
										    	//echo "X:".$diasNaturales." Y:".$diaConsecutivoRealizado;
										    	$diaConsecutivo=$diaConsecutivoRealizado+2;
										    	$hizoElDia=0;
										    }
										    else
										    {
										    	if($habitoRealizado<8)
										    	{
										    		$habito=$habito+1;
										    		$hizoElDia=0;
										    	}
										    	if($diaConsecutivoRealizado==6)
										    	{
										    		$diaConsecutivo=1;
										    	}
										    	if($diaConsecutivoRealizado==7)
										    	{
										    		$diaConsecutivo=2;
										    	}
										    }*/

											$diaHecho["habito"]=$habitoPrimo;
											$diaHecho["diaConsecutivo"]=$diaPrimo;
											
											array_push($diasConIconoPalomita, $diaHecho);
											if($habitoRealizado!=$habitoAnterior)//cambio de habito
											{
												$numeroDeDiasNoHechosSemanales=0;
											}
											$numeroDeDiasConsecutivosNoHechosSemanales=0;
											$numeroDeDiasConsecutivosNoHechosGlobales=0;
											$habitoAnterior=$habitoRealizado;//update habito anterior
										}
										else
										{
											$numeroDeDiasNoHechosGlobales=$numeroDeDiasNoHechosGlobales+1;
											$numeroDeDiasNoHechosSemanales=$numeroDeDiasNoHechosSemanales+1;
											if($esConsecutivo==1)
											{
												$numeroDeDiasConsecutivosNoHechosGlobales=$numeroDeDiasConsecutivosNoHechosGlobales+1;
												$numeroDeDiasConsecutivosNoHechosSemanales=$numeroDeDiasConsecutivosNoHechosSemanales+1;
											}
											else
											{
												$numeroDeDiasConsecutivosNoHechosGlobales=1;
												$numeroDeDiasConsecutivosNoHechosSemanales=1;
											}
											$esConsecutivo=1;
											//no debo de avanzar por:

											//si debo de avanzar por:
											//son dias naturales, el qeue sigue
											$hizoElDia=1;//si no hizo el dia.. tambien avanza! ¿porque habia puesto que no avanzaba?
										}
										//echo $diasNaturales." ";
										//if($diasNaturales==2)//el 2do dia siempre avanza
										if($diff==1)//diferencia entre dias es ==1
										{
											$hizoElDia=1;
												
										}
										else
										{

										}
										//validaciones globales!
										if($numeroDeDiasNoHechosGlobales>$limiteDeDiasGlobales)
										{
											$sql2=("UPDATE intentosInicio SET compromisoNoTerminado = 1 WHERE correo = '".$correo."' AND timestamp = ".$timestampDeInicio);
											if($query2 = mysql_query($sql2))//el 1 significa no terminado por causa de 8 dias salteados
											{
												echo '{ "success" : 3, "fecha" : "'.$fechaInicio.'" }';//compromiso cancelado por 8 dias NO seguidos
												exit();
												break;
											}
										}
										if($numeroDeDiasConsecutivosNoHechosGlobales>$limiteDeDiasConsecutivosGlobales)
										{
											$sql2=("UPDATE intentosInicio SET compromisoNoTerminado = 2 WHERE correo = '".$correo."' AND timestamp = ".$timestampDeInicio);
											if($query2 = mysql_query($sql2))//el 2 significa no terminado por causa de 5 dias seguidos
											{
												echo '{ "success" : 4, "fecha" : "'.$fechaInicio.'"}';//compromiso cancelado por 5 dias seguidos
												exit();
												break;
											}
										}
									}//if query avanze diario

									//aumenta 1 dia consecutivo, si se regreso de habito, debo de cambiar diaconsecutivo a 1!
									if($hizoElDia==1 && $diasNaturales!=2)//si hizo la actividad del dia
									{
										//echo "entro ".$diasNaturales;
										if($diaConsecutivo<7)
										{
											$diaConsecutivo=intval($diaConsecutivo)+1;
										}
										else
										{
											if($habito<8)
											{
												$habito=intval($habito)+1;
												$diaConsecutivo=1;
											}
											else
											{
												//?? ya terminamos
											}
										}
									}
									else
									{
										//echo "NO ".$diasNaturales;
									}
									//echo "NO ".$diaConsecutivo;
									//aqui irá?
									//aqui tengo que tener validaciones semanales para reiniciar el habito!
									if($numeroDeDiasConsecutivosNoHechosSemanales>$limiteDeDiasConsecutivosSemanales || $numeroDeDiasNoHechosSemanales>$limiteDeDiasSemanales)
									{
										//esto funciono cuando se reinicio el habito por primera vez!
										//si hizo el dia anterior
										//echo "aqui paso";
										$habitoREQUERIDO=-2;//avisar
										$diaConsecutivo=1;
										$numeroDeDiasNoHechosSemanales=0;
										$numeroDeDiasConsecutivosNoHechosSemanales=0;
									}
									//aumenta 1 dia
									$diaFinal=31;
									if($mes=="04" || $mes=="06" || $mes=="09" || $mes=="11")
									{
										$diaFinal=30;
									}
									if($mes=="02")
									{
										if(intval($ano)%4==0)//bisiesto
										{
											$diaFinal=29;
										}
										else
										{
											$diaFinal=28;
										}
									}
									if(intval($dia)<$diaFinal)
									{
										$dia=intval($dia)+1;
										if($dia<10)
										{
											$dia="0".$dia;
										}
										else
										{
											$dia="".$dia;
										}
									}
									else
									{
										if(intval($mes)<12)
										{
											$mes=intval($mes)+1;
											if($mes<10)
											{
												$mes="0".$mes;
											}
											else
											{
												$mes="".$mes;
											}
										}
										else
										{
											$ano=intval($ano)+1;
											$ano="".$ano;
											$mes="01";
										}
										$dia="01";
									}
									if($fechaActual==$fechaFinal)
									{
										$bandera=0;
										//$diaConsecutivo=1;//si la fecha que empezo es hoy.. pues va empezando!
									}
									$fechaActual="".$ano.$mes.$dia;
									//echo $diaConsecutivo.".".$fechaActual."-";
								}//while bandera


								//formula experimental!
								//validaciones semanales!
								//reiniciar el habito! seguro? no creo porque te saltas las validaciones globales!
								//si fueron 6 dias no consecutivos, entra aqui!
								if($numeroDeDiasConsecutivosNoHechosSemanales>$limiteDeDiasConsecutivosSemanales || $numeroDeDiasNoHechosSemanales>$limiteDeDiasSemanales)
								{
									//reseteo de habito!
									$habitoQueVoyAMandar = $habitoAnterior;
									if($diaConsecutivoRealizado==7)//el ultimo dia!
									{
										$habitoQueVoyAMandar=intval($habitoQueVoyAMandar)+1;
									}
									$reiniciado = 0;
									if($habitoREQUERIDO ==-1)//entoces si aviso
									{
										$reiniciado=1;
									}
									//esto es el dia actual! el dia-actividad que debe de hacer!!!
									echo '{ "success" : 1, "cosa" : 1, "nivel" : '.$nivel.',"reiniciado" : '.$reiniciado.', "timestampDeInicio" : '.$timestampDeInicio.', "habito" : '.$habitoQueVoyAMandar.' , "dia" : 1, "diasConIconoPalomita" : '.json_encode($diasConIconoPalomita).'}';
									exit();
								}
								//ahi va
								/*
								if($diaConsecutivo<7)
								{
									$diaConsecutivo=intval($diaConsecutivo)+1;
								}
								else
								{
									if($habito<8)
									{
										$habito=intval($habito)+1;
										$diaConsecutivo=1;
									}
									else
									{
										$habito=9;//¿?
									}
								}*/
								$reiniciado = 0;
								if($habitoREQUERIDO ==-2)//entoces si aviso
								{
									$reiniciado=1;
								}
								echo '{ "success" : 1, "siguele" : 1, "nivel" : '.$nivel.', "reiniciado" : '.$reiniciado.', "timestampDeInicio" : '.$timestampDeInicio.', "habito" : '.$habito.' , "dia" : '.$diaConsecutivo.', "diasConIconoPalomita" : '.json_encode($diasConIconoPalomita).'}';
								exit();
							}
							else
							{
								echo '{ "success" : 2, "sql1" : "'.$sql1.'",  "nivel" : '.$nivel.' }';//no tienes un compromiso activo!
								exit();
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveIMCWeb':
						if(!isset($_SESSION['MM_Username']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_SESSION['MM_Username'];
						$cm = $_POST['talla'];
						$kg = $_POST['peso'];
						$cintura = $_POST['cintura'];
						$presion="0";
						if($_POST["presion"]!="")
						{
							$presion = $_POST['presion'];	
						}

						$glucosa="0";
						if($_POST["glucosa"]!="")
						{
							$glucosa = $_POST['glucosa'];	
						}
						$colesterol="0";
						if($_POST["colesterol"]!="")
						{
							$colesterol = $_POST['colesterol'];	
						}
						$trigliceridos="0";
						if($_POST["trigliceridos"]!="")
						{
							$trigliceridos = $_POST['trigliceridos'];	
						}

						$presionhg="0";
						if($_POST["presionhg"]!="")
						{
							$presionhg = $_POST['presionhg'];	
						}
						$ldl="0";
						if($_POST["ldl"]!="")
						{
							$ldl = $_POST['ldl'];	
						}
						$hdl="0";
						if($_POST["hdl"]!="")
						{
							$hdl = $_POST['hdl'];	
						}
						$sql=("INSERT INTO imc (correo, cm, kg, timestamp,cintura, glucosa, colesterol, trigliceridos, presionhg, ldl, hdl,presion) VALUES ('".$correo."',".$cm.",".$kg.", ".time().",".$cintura.",".$glucosa.",".$colesterol.",".$trigliceridos.",".$presionhg.",".$ldl.",".$hdl.",".$presion.")");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveIMC':
						$correo = $_POST['correo'];
						$cm = $_POST['cm'];
						$kg = $_POST['kg'];
						$sql=("INSERT INTO imc (correo, cm, kg, timestamp) VALUES ('".$correo."',".$cm.",".$kg.", ".time().")");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'deleteHorarioWEB':
						$correo = $_SESSION['MM_Username'];
						$horario = $_POST['horario'];
						$sql=("DELETE FROM Horarios WHERE correo = '".$correo."' AND horario = '".$horario."'");
						if($query = mysql_query($sql))
						{
							$horarios = array();
							$sql1=("SELECT horario FROM Horarios WHERE correo = '".$correo."'");
							if($query1 = mysql_query($sql1))
							{
								while($row1=mysql_fetch_array($query1))
								{
									$row1["horario"] = utf8_encode($row1["horario"]);
									array_push($horarios, $row1);
								}
								echo '{ "success" : 1, "horarios" : '.json_encode($horarios).' }';
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'deleteHorario':
						$correo = $_POST['correo'];
						$horario = $_POST['horario'];
						$sql=("DELETE FROM Horarios WHERE correo = '".$correo."' AND horario = '".$horario."'");
						if($query = mysql_query($sql))
						{
							$horarios = array();
							$sql1=("SELECT horario FROM Horarios WHERE correo = '".$correo."'");
							if($query1 = mysql_query($sql1))
							{
								while($row1=mysql_fetch_array($query1))
								{
									$row1["horario"] = utf8_encode($row1["horario"]);
									array_push($horarios, $row1);
								}
								echo '{ "success" : 1, "horarios" : '.json_encode($horarios).' }';
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveHorarioWEB':
						$correo = $_SESSION['MM_Username'];
						$horario = $_POST['horario'];
						$descripcion = utf8_decode($_POST['descripcion']);
						$sql=("INSERT INTO Horarios (correo, horario,descripcion) VALUES ('".$correo."','".$horario."','".$descripcion."')");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveHorario':
						$correo = $_POST['correo'];
						$horario = $_POST['horario'];
						$descripcion = utf8_decode($_POST['descripcion']);
						$sql=("INSERT INTO Horarios (correo, horario,descripcion) VALUES ('".$correo."','".$horario."','".$descripcion."')");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getHorariosWEB':
						$correo = $_SESSION['MM_Username'];
						$horarios = array();
						$sql1=("SELECT horario, descripcion FROM Horarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								$row1["horario"] = utf8_encode($row1["horario"]);
								$row1["descripcion"] = utf8_encode($row1["descripcion"]);
								array_push($horarios, $row1);
							}
							echo '{ "success" : 1, "horarios" : '.json_encode(utf8ize($horarios)).' }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getHorarios':
						$correo = $_POST['correo'];
						$horarios = array();
						$sql1=("SELECT horario, descripcion FROM Horarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								$row1["horario"] = utf8_encode($row1["horario"]);
								$row1["descripcion"] = utf8_encode($row1["descripcion"]);
								array_push($horarios, $row1);
							}
							echo '{ "success" : 1, "horarios" : '.json_encode($horarios).' }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getGPSWeb':
						$correo = $_SESSION['MM_Username'];
						$sql1=("SELECT latitud, longitud FROM Comunidades WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$latitud = $row1["latitud"];
								$longitud = $row1["longitud"];
								echo '{ "success" : 1, "latitud" : '.$latitud.', "longitud" : '.$longitud.' }';
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getGPS':
						$correo = $_POST['correo'];
						$sql1=("SELECT latitud, longitud FROM Comunidades WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$latitud = $row1["latitud"];
								$longitud = $row1["longitud"];
								echo '{ "success" : 1, "latitud" : '.$latitud.', "longitud" : '.$longitud.' }';
								exit(0);
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveGPSWEB':
						$correo = $_SESSION['MM_Username'];
						$latitud = $_POST['latitud'];
						$longitud = $_POST['longitud'];
						$sql1=("SELECT latitud, longitud FROM Comunidades WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$sql=("UPDATE Comunidades SET latitud = '".$latitud."', longitud = '".$longitud."' WHERE correo = '".$correo."'");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1 }';
									exit(0);
								}
							}
							else
							{
								$sql=("INSERT INTO Comunidades (correo, latitud, longitud) VALUES ('".$correo."',".$latitud.",".$longitud.")");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1 }';
									exit(0);
								}
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveGPS':
						$correo = $_POST['correo'];
						$latitud = $_POST['latitud'];
						$longitud = $_POST['longitud'];
						$sql1=("SELECT latitud, longitud FROM Comunidades WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$sql=("UPDATE Comunidades SET latitud = '".$latitud."', longitud = '".$longitud."' WHERE correo = '".$correo."'");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1 }';
									exit(0);
								}
							}
							else
							{
								$sql=("INSERT INTO Comunidades (correo, latitud, longitud) VALUES ('".$correo."',".$latitud.",".$longitud.")");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1 }';
									exit(0);
								}
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveToken':
						$correo = $_POST['correo'];
						$token = $_POST['token'];
						$tipo = $_POST['tipo'];
						$sql=("UPDATE Usuarios SET tipoDispositivo = ".$tipo.", token = '".$token."' WHERE correo = '".$correo."'");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'saveReto':
						$correo = $_POST['correo'];
						$reto = $_POST['reto'];
						$fechaUltimoReto = $_POST['fechaUltimoReto'];
						$sql=("UPDATE Usuarios SET reto = ".$reto.", fechaUltimoReto = ".$fechaUltimoReto." WHERE correo = '".$correo."'");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
				}
		break;
		case 'nombres':
				switch($accion)
				{
					case 'save':
						$correo = $_POST['correo'];
						$idFacebook = $_POST['idF'];
						$nombre = utf8_decode($_POST['nombre']);
						$gender = $_POST['gender'];
						$age = $_POST['age'];
						$picture = $_POST['picture'];
						$sql1=("SELECT reto, esPromotor, fechaUltimoReto FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$reto = $row1["reto"];
								$esPromotor = $row1["esPromotor"];
								$fechaUltimoReto = $row1["fechaUltimoReto"];
								/*if(!isset($_SESSION))
							    {
							    	ini_set('session.gc_maxlifetime', 36000);
									session_set_cookie_params(36000);
							       	session_start();  
							    }
								$_SESSION["nombre"]=$nombre;
								$_SESSION["age"]=$age;
								$_SESSION["gender"]=$gender;
								$_SESSION["idFacebook"]=$idFacebook;
								$_SESSION["correo"]=$correo;
							*/
								$sql=("UPDATE Usuarios SET idFacebook = '".$idFacebook."', nombre = '".$nombre."', gender = '".$gender."', age = ".$age.", picture = '".$picture."' WHERE correo = '".$correo."'");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1, "primeraVez" : 0, "fechaUltimoReto" : '.$fechaUltimoReto.', "esPromotor" : '.$esPromotor.', "reto" : '.$reto.' }';
									exit(0);
								}
							}
							else
							{
								if(!isset($_SESSION))
							    {
							    	ini_set('session.gc_maxlifetime', 36000);
									session_set_cookie_params(36000);
							       	session_start();  
							    }
								$_SESSION["nombre"]=$nombre;
								$_SESSION["age"]=$age;
								$_SESSION["gender"]=$gender;
								$_SESSION["idFacebook"]=$idFacebook;
								$_SESSION["MM_Username"]=$correo;
								
								$sql=("INSERT INTO Usuarios (idFacebook, nombre, correo, gender, age, picture,reto) VALUES ('".$idFacebook."','".$nombre."','".$correo."','".$gender."',".$age.",'".$picture."',1)");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1, "primeraVez" : 1, "fechaUltimoReto" : 20160101, "esPromotor" : 0, "reto" : 1 }';
									exit(0);
								}
							}
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
				}
		break;		
		case 'mensajes':
				switch($accion)
				{
					case 'listDia':
						$fecha = $_POST['fecha'];
						$mensajes = array();
						$sql1=("SELECT m.mensaje, m.fecha, n.name FROM mensajes m INNER JOIN nombres n on m.idF = n.idF WHERE m.fecha = '".$fecha."' order by m.timestamp desc");
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								$row1["mensaje"] = utf8_encode($row1["mensaje"]);
								$row1["name"] = utf8_encode($row1["name"]);
								//$fecha = $row1["fecha"];
								array_push($mensajes, $row1);
							}
							echo '{ "success" : 1 ,"queonda" : "'.$sql1.'", "mensajes" :  '.json_encode( $mensajes ).'}';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'save':
						$idF = $_POST['idF'];
						$fecha = $_POST['fecha'];
						$mensaje = utf8_decode($_POST['mensaje']);
						$sql=("INSERT INTO mensajes (idF,fecha,mensaje,timestamp) VALUES ('".$idF."','".$fecha."','".$mensaje."', ".time().")");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
				}
		break;
		case 'post':
				switch($accion)
				{
					case 'save':
						$idF = $_POST['idF'];
						$timestamp = $_POST['timestamp'];
						$fecha = $_POST['fecha'];
						$texto = utf8_decode($_POST['texto']);
						$sql=("INSERT INTO post (idF, timestamp,fecha,texto) VALUES ('".$idF."',".$timestamp.",'".$fecha."','".$texto."')");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'delete':
						$idF = $_POST['idF'];
						$sql=("DELETE FROM post WHERE idF ='".$idF."'");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
				}
		break;			
	}
?>