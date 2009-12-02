var map;  // Google Map2 物件
var ge;   // Google Earth Plugin 物件
var icon;
var tm;   // Google Map2 Timeline

// 註冊 onReady Event
// 參考: http://docs.jquery.com/Events
$(document).ready(function() {

  // 呼叫 Google Map API 載入地圖
  onLoad();
  GUnload();

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
  $('#mapcontainer').css( { height: map_height } );
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
  $('#mapcontainer').css( { height: map_height } );
  $('#main').css( { height: map_height } );
});          
             
function onLoad() {

        tm = TimeMap.init({
	mapId: "map",               // Id of map div element (required)
	timelineId: "timeline",     // Id of timeline div element (required) 
	datasets: [
	    {
                id: "artists",
		title: "Artists",
		theme: TimeMapDataset.orangeTheme({eventIconPath: "./image"}),
		// note that the lines below are now the preferred syntax
		type: "basic",
		options: {
		    items: [
			{
			  "start" : "1981",
                          "end" : "2009-01-11",
			  "point" : {
			      "lat" : 23.8123,
		              "lon" : 121.123
			   },
			  "title" : "中央氣象局",
			  "options" : {
			    // set the full HTML for the info window
			    "infoHtml": "<div class='custominfostyle'><b>中央氣象局.</div>"
			  }
			},
			{
			  "start" : "1991",
			  "end" : "2010",
			  "point" : {
			      "lat" : 22.5234,
			      "lon" : 120.534
			   },
			 "title" : "海洋科技研究中心",
			 "options" : { 
			   // load HTML from another file via AJAX
			   // Note that this may break in IE if you're running it with
			   // a local file, due to cross-site scripting restrictions
			   "infoUrl": "http://www.nchc.org.tw",
			   "theme": TimeMapDataset.redTheme({eventIconPath: "./image"})
			  }
		        },  
                        {
			 "start" : "2001",
			 "end" : "2020",
			 "point" : {
			     "lat" : 24.8345,
			     "lon" : 122.845
			  },
			 "title" : "經濟部水利署",
			 "options" : {
			   // use the default title/description info window
			   "description": "Renaissance Man",
			   "theme": TimeMapDataset.yellowTheme({eventIconPath: "image/"})
			  }
			}
                      ]
		    }
		}   
	    ],
	    bandIntervals: [      
		Timeline.DateTime.DECADE, 
		Timeline.DateTime.CENTURY
	    ]  
	});
        // manipulate the timemap further here if you like
	
      if (GBrowserIsCompatible()) {

	// 宣告 TimelineMap 的 MapID 對應到原本的 map
	map = tm.map;  
	// 取得 DOM 中,名稱為 map 的元件
	map = new GMap2(document.getElementById("map"));
	// 加入左上角比例尺規控制列
	map.addControl(new GLargeMapControl3D());
	// 鳥瞰圖
	map.addControl(new GOverviewMapControl());
	// Mouse Zoom In/Out
	map.enableScrollWheelZoom();
	// 加入左下角比例尺狀態列
	map.addControl(new GScaleControl());
	// 加入右上角"地圖","衛星","混合地圖"按鈕
	map.addControl(new GMapTypeControl());
	// Google Earth
	map.addMapType(G_SATELLITE_3D_MAP);
	// DragZoom Properties
	var otherOpts = { 
	  buttonStartingStyle: {background: '#FFF', paddingTop: '4px', paddingLeft: '4px', border:'1px solid black'},
	  buttonHTML: "<img title='Drag Zoom In' src='image/zoomin.gif'>",
	  buttonStyle: {width:'25px', height:'25px'},
	  buttonZoomingHTML: '請選取範圍',
	  buttonZoomingStyle: {background:'yellow',width:'85px', height:'100%'},
	  backButtonHTML: "<img title='Zoom Back Out' src='image/zoomout.gif'>",
	  backButtonStyle: {display:'none',marginTop:'5px',width:'25px', height:'25px'},
	  backButtonEnabled: true, 
          overlayRemoveTime: 1500
	}
	// DragZoom Control
	map.addControl(new DragZoomControl({}, otherOpts, {}),new GControlPosition(G_ANCHOR_BOTTOM_LEFT,new GSize(20,60)));
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

