<?php
	ini_set("display_errors", 0);	
	header("Content-Type: text/html; charset=ISO_8859-1");
	header("Content-type: text/javascript; charset=iso-8859-1");
	$variables = array_keys($HTTP_POST_VARS); 
    $valores = array_values($HTTP_POST_VARS); 
	
							
							     
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

class connectionMinisterial {
	
	public $conn;		//Variable publica donde se guardara el objeto de conexion
	public $flagConn; 	//Boolean
	
	private $username;
	private $password;
	private $hostname;
	private $database;
	
	public function __construct(){
		
		$this->username = "db186407";
		$this->password = "thanks_God7";
		$this->hostname = "internal-db.s186407.gridserver.com";
		$this->database = "db186407_sano";
	
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
	
switch($servicio)
	{
		case 'login':
				switch($accion)
				{
					case 'guardarCambios':
						if(!isset($_SESSION['idPersona']))
						{
							echo '{ "success" : 0 }';
							exit();
						}
						$correo = $_POST['correo'];
						$valor = $_POST['valor'];
						$esPromotor = 0;
						$sql1=("SELECT esPromotor FROM Usuarios WHERE correo = '".$correo."'");
						if($query1 = mysql_query($sql1))
						{
							if($row1=mysql_fetch_array($query1))
							{
								$esPromotor = $row1["$esPromotor"];
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
							$mail->addAddress($correo, 'Promotr de salud');
							$titulo = 'Hola, has sido nombrado promotor de salud QVS.';
							$cadLink = '<div>¡Felicidades!, has sido nombrado <b>Promotor de Salud QVS</b>, por favor vuelve a iniciar sesi&oacute;n en la aplicaci&oacute;n para indicar tu lugar de reuni&oacute;n y los horarios de tu comunidad Quiero Vivir Sano.</div>';							
							if($valor==0)//ya no es promotor
							{
								$titulo = 'Hola, ha sido dado de baja de la lista de promotores de salud QVS.';
								$cadLink = '<div>¡Hola!, has sido dado de baja como <b>Promotor de Salud QVS</b>, si crees que esto fue un error, favor de notificarlo al campo local.</div>';							
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
						if($query1 = mysql_query($sql1))
						{
							while($row1=mysql_fetch_array($query1))
							{
								$row1["nombre"]=utf8_encode($row1["nombre"]);
								array_push($promotores, $row1);							
							}
							echo '{ "success" : 1, "promotores" : '.json_encode($promotores).' }';
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
					case 'saveHorario':
						$correo = $_POST['correo'];
						$horario = $_POST['horario'];
						$sql=("INSERT INTO Horarios (correo, horario) VALUES ('".$correo."','".$horario."')");
						if($query = mysql_query($sql))
						{
							echo '{ "success" : 1 }';
							exit(0);
						}
						echo '{ "success" : 0 }';
						exit(0);
					break;
					case 'getHorarios':
						$correo = $_POST['correo'];
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
								$sql=("UPDATE Usuarios SET idFacebook = '".$idFacebook."', nombre = '".$nombre."', gender = '".$gender."', age = ".$age.", picture = '".$picture."' WHERE correo = '".$correo."'");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1, "fechaUltimoReto" : '.$fechaUltimoReto.', "esPromotor" : '.$esPromotor.', "reto" : '.$reto.' }';
									exit(0);
								}
							}
							else
							{
								$sql=("INSERT INTO Usuarios (idFacebook, nombre, correo, gender, age, picture,reto) VALUES ('".$idFacebook."','".$nombre."','".$correo."','".$gender."',".$age.",'".$picture."',1)");
								if($query = mysql_query($sql))
								{
									echo '{ "success" : 1, "fechaUltimoReto" : 20160101, "esPromotor" : 0, "reto" : 1 }';
									exit(0);
								}
							}
						}
						echo '{ "success" : 0, "sql" : "'.$sql.'", "sql1" : "'.$sql1.'" }';
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
						echo '{ "success" : 0, "sql" : "'.$sql1.'" }';
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