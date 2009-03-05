<?
  require_once('../db-config/connect-mysql.php');
  $query = "SELECT data_type.serial AS type_id, maincase_new.owner_org, maincase_new.loc1_lon, maincase_new.loc1_lat, maincase_new.description, maincase_new.website FROM data_type, maincase_new, maincase_detail WHERE maincase_detail.maincase_id = maincase_new.serial AND maincase_detail.type_id = data_type.serial AND type_id =" . $_GET['type_id'] . " AND owner_org = '" . $_GET['owner_org'] . "' ORDER BY loc1_lon, loc1_lat";
  if ($database_connect) mysql_select_db($database_connect) or die('USE '.$database_connect.' failed!');
  $result = mysql_query($query) or die("Query failed! $query");
  $rows   = mysql_num_rows ($result);
  if ($rows != 0)
  {
    echo "[\n";
    for ($i=0 ; $i < $rows ; $i++)
    {
      $col= mysql_fetch_row($result);
      echo "{ \"type_id\" : " . $col[0] . ", \"owner_org\" : \"" . $col[1] . "\", \"loc1_lon\" : \"" . $col[2] . "\", \"loc1_lat\" : \"" . $col[3] . "\", \"description\" : \"" . $col[4] . "\", \"website\" : \"" . $col[5] . "\"},\n";
    }
    echo "]";
  }
?>
