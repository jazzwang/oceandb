var map;  // Google Map2 物件
var ge;   // Google Earth Plugin 物件
var icon;

// 註冊 onReady Event
// 參考: http://docs.jquery.com/Events
$(document).ready(function() {

  // 呼叫 Google Map API 載入地圖
  load();

  var PARENT_ID = [];	  // 產生一個空的陣列
  PARENT_ID[1] = "定點";
  PARENT_ID[2] = "船測";

  // 註冊 AJAX 非同步處理函式
  // 從 data/map-menu.json 讀取資料來產生 map-menu 的 Accordion 選單
  $.getJSON("data/map-menu.json", function(data){
    // 讀取進來的 JSON 內容必須用 eval 函數才能變成 javascript 可以識別的陣列
    var json = eval(data);
    // 註: 因為 JSON 內容按 type_id 排序，
    //	   故用 type_id 來判斷第一次出現的 type_id 產生新的 DOM
    var type_id = -1;
    var count = 1;
    $.each(json, function(i, item){
      // 確認 type_id 是否存在，否則產生一個新的 DOM
      if(item.type_id != type_id )
      {      
	$('#map-menu').append("<h3><a href='#'>" + item.type_name  
			      + " (" + PARENT_ID[item.parent_id] + ")</a>"
			      + "</h3><div><ul id='map-menu-" + item.type_id 
			      + "'></ul></div>");
	type_id = item.type_id;
	// 當產生新的 DOM 時，把計數回歸到 1 產生 map-menu-type_id-count 的 id
	count = 1;   
	/* TODO: 加入全選處理函式
	$("#map-menu-" + item.type_id).append("<li><input type='checkbox'>"
		       + "<font color='red'><b>=== 以下全選 ===</b></font>"
		       + "</input></li>");
	var temp = $("#map-menu-" + item.type_id).find("input");
	temp.click(function(){
	  // TODO: 加入全選處理函式
	  this.checked ? alert("map-menu-" + item.type_id + " is clicked!") : 
			 alert("map-menu-" + item.type_id + " is unclicked!");
	});
	*/
      }
      // 根據 type_id 逐一加入 owner_org
      $("#map-menu-" + item.type_id).append("<li><input type='checkbox' "
		     + "id='map-menu-" + item.type_id + "-" + count +"'>"
		     + item.owner_org + "</input></li>");

      // 定義 checkbox checked 跟 unchecked 對應的處理函式
      $("#map-menu-" + item.type_id + "-" + count).click(function(){
	var checked;
	if(this.checked){ checked=true; } else { checked=false; }
	$.ajax({
	  type: "GET",
	  url:  "data/get_data.php",
	  data: "type_id=" + item.type_id + "&owner_org=" + item.owner_org ,
	  success: function(data){
	    //alert(data);
	    var json = eval(data);
	    $.each(json,function(i,item){
	      if(checked) {
		var latlon = new GLatLng(item.loc1_lat, item.loc1_lon);
		var marker = new GMarker(latlon, icon);
		GEvent.addListener(marker, 'click', function() {
		  map.openInfoWindowHtml(latlon, "描述：" + item.description
		  + "<br/>連結：<a href='" + item.website 
		  + "' target='_NEW'>" + item.website + "</a>"
		  + "<iframe width='640' height='300' src='" 
		  + item.website + "'/>");
		});
		map.addOverlay(marker);
	      } else {
		map.clearOverlays();
		map.closeInfoWindow();
	      }
	    });
	  }
	});
      });

      // 把計數加 1
      count = count + 1;
    });

    // 設定左側選單的 Accordion 風格
    // 註: 這行的擺放位置很重要，放在迴圈外會造成 CSS 樣式(class)的問題
    // 主因: getJSON 是非同步處理，得把動態產生 DOM 的相關設定擺在 callback 中
    $('#map-menu').accordion({
	    header: "h3",
	    autoHeight: false,
	    collapsible: true
    });

    // 完成從 JSON 讀入資料，因此把 loading 提示移除。
    $('#loading').remove();
  });

  // 設定地圖高度
  var map_height=document.documentElement.clientHeight - 68;
  $('#main').css( { height: map_height } );

  // 設定點選 "MENU" 的行為
  $('#btnMenu').click(function()
  {
    if($('#map-menu').css("display") != "none")
    {
      $('#map-menu').css({ display: 'none' });
      $('#map').css({ width: '100%' });
    } else {
      $('#map-menu').css({ display: 'block'});
      $('#map').css({ width: '80%'});
    }
  });
});

// 註冊 window 物件的 onResize Event
// 參考: http://docs.jquery.com/Events
$(window).resize(function() {
  // 當改變瀏覽器大小時，重新設定地圖高度
  var map_height=document.documentElement.clientHeight - 68;
  $('#main').css( { height: map_height } );
});

function load() 
{
  if (GBrowserIsCompatible()) {
    // 取得 DOM 中,名稱為 map 的元件
    map = new GMap2(document.getElementById("map"));  
    // 加入左上角比例尺規控制列
    map.addControl(new GLargeMapControl());               
    // 加入左下角比例尺狀態列
    map.addControl(new GScaleControl());
    // 加入右上角"地圖","衛星","混合地圖"按鈕
    map.addControl(new GMapTypeControl());
    // 加入右上角 Google Earth 的"地球"按鈕
    map.addMapType(G_SATELLITE_3D_MAP);
    // 設定預設經緯度北緯 23.8, 東經 121, 預設比例尺 100 公里(7)
    map.setCenter(new GLatLng(23.8,121), 7);
    // 設定預設底圖為"衛星"
    map.setMapType(G_SATELLITE_MAP);
    // 產生預設 icon 圖示
    icon = new GIcon();
    icon.image  = "image/icon.png";
    icon.shadow = "image/icon.png";
    icon.iconSize = new GSize(12, 12);
    icon.shadowSize = new GSize(12, 12);
    icon.iconAnchor = new GPoint(12, 12);
    icon.infoWindowAnchor = new GPoint(12, 12);
  }
}
