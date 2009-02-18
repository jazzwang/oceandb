$(document).ready(function() {
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

  $('#map-menu').accordion({ header: "h3" });
});

function load() {
  if (GBrowserIsCompatible()) {
    var map = new GMap2(document.getElementById("map"));  // 取得 DOM 中,名稱為 map 的元件
    map.addControl(new GLargeMapControl());               // 加入左上角比例尺規控制列
    map.addControl(new GScaleControl());                  // 加入左下角比例尺狀態列
    map.addControl(new GMapTypeControl());                // 加入右上角"地圖","衛星","混合地圖"按鈕
    map.setCenter(new GLatLng(23.8,121), 7);              // 設定預設經緯度北緯 23.8, 東經 121, 預設比例尺 100 公里(7)
    map.setMapType(G_SATELLITE_MAP);                      // 設定預設底圖為"衛星"
  }
}
