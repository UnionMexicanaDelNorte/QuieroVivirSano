<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"
$hostname_cnnQVS = "";
$database_cnnQVS = "";
$username_cnnQVS = "";
$password_cnnQVS = "";
$cnnQVS = mysql_pconnect($hostname_cnnQVS, $username_cnnQVS, $password_cnnQVS) or trigger_error(mysql_error(),E_USER_ERROR); 
?>