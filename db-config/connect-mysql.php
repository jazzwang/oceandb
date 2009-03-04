<?php
$hostname_connect = "localhost";
$database_connect = "ncor";
$username_connect = "oceandb";
$password_connect = "torioceandb";
$connect = mysql_pconnect($hostname_connect, $username_connect, $password_connect) or trigger_error(mysql_error(),E_USER_ERROR); 
mysql_query("SET NAMES 'utf8'");
?>
