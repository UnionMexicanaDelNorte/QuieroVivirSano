<?php
session_start();

include_once( 'config.php' );
include_once( 'src/Facebook/autoload.php' );
//include 'qvs.php';

$servername = "internal-db.s186407.gridserver.com";
$username = "db186407";
$password = "thanks_God7";
$dbname = "db186407_sano";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
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

  $session = $helper->getSessionFromRedirect();

} catch(src\Facebook\Exceptions\FacebookResponseException $e) {  
  // When Graph returns an error  
  
  echo 'Graph returned an error: ' . $e->getMessage(); 
      session_destroy();
    // redirecting user back to app login page
    header("Location: http://quierovivirsano.org/app/index.php"); // ./ 
  exit;  
} catch(src\Facebook\Exceptions\FacebookSDKException $e) {  
  // When validation fails or other local issues  

  echo 'Facebook SDK returned an error: ' . $e->getMessage();  
  exit;  
}  

if (isset($accessToken)) {
  // Logged in!
  $_SESSION['facebook_access_token'] = (string) $accessToken;
    


try {
  // Get the Facebook\GraphNodes\GraphUser object for the current user.
  // If you provided a 'default_access_token', the '{access-token}' is optional.
  $response = $fb->get('/me?fields=id,name,email', $accessToken->getValue());
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
/* $age = $me->getProperty('age_range');
$gender = $me->getProperty('gender');
$picture = $me->getProperty('picture'); */

//echo "Full Name: ". $nombre ."<br>";
//echo "Email: ". $correo ."<br>";
//echo "Facebook ID:" . $idFacebook;

$sql = "SELECT idFacebook,nombre,correo FROM usuarios WHERE idFacebook='".$idFacebook."'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "Hola : " . $row["nombre"] . "<br>";
    }
} else {
    
      $sql2 = "INSERT INTO usuarios (idFacebook, nombre, correo)
      VALUES ('".$idFacebook."', '" .$nombre. "', '" .$correo."')";

      if ($conn->query($sql2) === TRUE) {
          echo "Bienvenido " . $nombre;
      } else {
          echo "Error: " . $sql2 . ", No es posible registrar al usuario.<br>" . $conn->error;
      }
}

$conn->close();

$logoutUrl = $helper->getLogoutUrl($_SESSION['facebook_access_token'], 'http://quierovivirsano.org/app/index.php');
echo '<a href="' . $logoutUrl . '">Logout</a>';

}else{

  echo '<a href="http://quierovivirsano.org/app/login.php">Login</a>';
}

?>