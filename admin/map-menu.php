<?
  require_once('db-config/connect-mysql.php');
  $query = "SELECT DISTINCT data_type.serial AS type_id, data_type.parent_id, data_type.name AS TYPE , maincase_new.owner_org FROM data_type, maincase_new, maincase_detail WHERE maincase_detail.maincase_id = maincase_new.serial AND maincase_detail.type_id = data_type.serial ORDER BY type_id, owner_org";
  if ($database_connect) mysql_select_db($database_connect) or die('USE '.$database_connect.' failed!');
  $result = mysql_query($query) or die("Query failed! $query");
  $rows   = mysql_num_rows ($result);
  if ($rows != 0)
  {
    echo "[\n";
    for ($i=0 ; $i < $rows ; $i++)
    {
      $col= mysql_fetch_row($result);
      echo "{ \"type_id\" : " . $col[0] . ", \"parent_id\" : " . $col[1] . ". \"type_name\" : \"" . $col[2] . "\" , \"owner_org\" : \"" . $col[3] . "\" },\n";
    }
    echo "]";
  }
?>
