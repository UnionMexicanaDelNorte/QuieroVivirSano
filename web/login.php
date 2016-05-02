<?php
session_start();  

include_once( 'config.php' );
include_once( 'src/Facebook/autoload.php' );


$permissions = ['email,public_profile,user_friends']; // Optional permissions for more permission you need to send your application for review
$loginUrl = $helper->getLoginUrl('http://quierovivirsano.org/app/callback.php', $permissions);
header("location: ".$loginUrl);

?>