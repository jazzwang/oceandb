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
