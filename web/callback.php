<?php
session_start();

require_once('Connections/cnnQVS.php'); 
include_once( 'config.php' );
include_once( 'src/Facebook/autoload.php' );

ini_set('allow_url_fopen', '1');


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


use src\Facebook\FacebookSession;
use src\Facebook\FacebookRedirectLoginHelper;
use src\Facebook\FacebookRequest;
use src\Facebook\FacebookResponse;
use src\Facebook\GraphUser;
use src\Facebook\GraphObject;
use src\Facebook\FacebookRequestException;

try {  
  $accessToken = $helper->getAccessToken(); 


  //$session = $helper->getSessionFromRedirect();

} catch(src\Facebook\Exceptions\FacebookResponseException $e) {  
  // When Graph returns an error  
  
  echo 'Graph returned an error: ' . $e->getMessage(); 
      session_destroy();
    // redirecting user back to app login page
    header("Location: http://quierovivirsano.org/app/index.php"); 
  exit;  
} catch(src\Facebook\Exceptions\FacebookSDKException $e) {  
  // When validation fails or other local issues  

  echo 'Facebook SDK returned an error: ' . $e->getMessage();  
  exit;  
}  

if (isset($accessToken)) 
{
    // Logged in!
    $_SESSION['facebook_access_token'] = (string) $accessToken;
   

  try {

    // Get the Facebook\GraphNodes\GraphUser object for the current user.
    // If you provided a 'default_access_token', the '{access-token}' is optional.
    $response = $fb->get('/me?fields=id,name,email,age_range,gender,picture', $accessToken->getValue());
  //  print_r($response);
  } catch(src\Facebook\Exceptions\FacebookResponseException $e) {
    // When Graph returns an error
    echo 'ERROR: Graph ' . $e->getMessage();
    exit;
  } catch(src\Facebook\Exceptions\FacebookSDKException $e) {
    // When validation fails or other local issues
    echo 'ERROR: validation fails ' . $e->getMessage();
    exit;
  } 




  $me = $response->getGraphUser();
  //print_r($me);

  $idFacebook = $me->getProperty('id');
  $nombre = $me->getProperty('name');
  $correo = $me->getProperty('email');
  $age = $me->getProperty('age_range');
  $gender = $me->getProperty('gender');
  $MinAge = $age[min];

  $picture = $me->getProperty('picture');

  $profile_pic =  "http://graph.facebook.com/".$idFacebook."/picture?type=large";
  $img = file_get_contents($profile_pic);
  $imgdata = base64_encode($img);

    //datos a enviar
    $data = array("servicio" => "nombres","accion" => "save", "correo" => $correo, "idF" => $idFacebook, "nombre" => $nombre, "gender" => $gender,"age" => $MinAge,"picture" => $imgdata,);
    //url contra la que atacamos
    $ch = curl_init("http://quierovivirsano.org/app/qvs.php");
    //a true, obtendremos una respuesta de la url, en otro caso, 
    //true si es correcto, false si no lo es
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //establecemos el verbo http que queremos utilizar para la petición
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    //enviamos el array data
    curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($data));
    //obtenemos la respuesta
    $response = curl_exec($ch);
    // Se cierra el recurso CURL y se liberan los recursos del sistema
    curl_close($ch);
    if(!$response) {
        return false;
    }else{
      $respose = json_encode($response);
      //echo $response;
    $json = json_decode($response,true);
    //echo $json;
    //echo  json_encode($json);
  //echo $json["primeraVez"];
  //      echo $json->{'primeraVez'};
    //    exit(0);
        $loginUsername=$correo;
        $password=$idFacebook;

        $MM_fldUserAuthorization = "";
        $MM_redirectLoginSuccess = "access.php";
        $sexo="2";//mujer
        if($json["gender"]=="male")
        {
          $sexo='1';
        }
        if($json["primeraVez"]==1)
        {
          
          //echo $json;
          $MM_redirectLoginSuccess = "access.php?p=".$sexo;
        }



        $MM_redirectLoginFailed = "index.php";
        $MM_redirecttoReferrer = true;
        mysql_select_db($database_cnnQVS, $cnnQVS);
        
        $LoginRS__query=sprintf("SELECT correo, idFacebook FROM Usuarios WHERE correo=%s AND idFacebook=%s",
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


      //var_dump($response);

      //echo "<br>nombre:".$nombre."<br>";
      //echo "Si";
      //header('Location:welcome.php');
    }

  }

?>


