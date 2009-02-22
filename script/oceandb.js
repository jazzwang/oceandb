// 註冊 onReady Event
// 參考: http://docs.jquery.com/Events
$(document).ready(function() {

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
    $.each(json, function(i, item){
      // 確認 type_id 是否存在，否則產生一個新的 DOM
      if(item.type_id != type_id )
      {      
	$('#map-menu').append("<div><h3><a href='#'>" + item.type_name  
			      + " (" + PARENT_ID[item.parent_id] + ")</a>"
			      + "</h3><div><ul id='map-menu-" + item.type_id 
			      + "'></ul><br/></div></div>");
	type_id = item.type_id;
	$("#map-menu-" + item.type_id).append("<li><input type='checkbox'>"
		       + "<font color='red'><b>=== 以下全選 ===</b></font>"
		       + "</input></li>");
	var temp = $("#map-menu-" + item.type_id).find("input");
	temp.click(function(){
	  // TODO: 加入全選處理函式
	  this.checked ? alert("map-menu-" + item.type_id + " is clicked!") : 
			 alert("map-menu-" + item.type_id + " is unclicked!");
	});
      }
      // 根據 type_id 逐一加入 owner_org
      $("#map-menu-" + item.type_id).append("<li><input type='checkbox'>"
		     + item.owner_org + "</input></li>");

      // TODO: 定義 checkbox checked 跟 unchecked 對應的處理函式
    });

    // 設定左側選單的 Accordion 風格
    // 註: 這行的擺放位置很重要，放在迴圈外會造成 CSS 樣式(class)的問題
    // 主因: getJSON 是非同步處理，得把動態產生 DOM 的相關設定擺在 callback 中
    $('#map-menu').accordion({ header: "h3" });

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
