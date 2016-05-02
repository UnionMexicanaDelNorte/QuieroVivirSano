<?php

include_once( 'src/Facebook/autoload.php' );


$fb = new Facebook\Facebook([
  'app_id' => '', //
  'app_secret' => '', //
  'default_graph_version' => 'v2.5',
]);  

  
$helper = $fb->getRedirectLoginHelper(); 

?>