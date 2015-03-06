$(document).on ('page:change', function() {
  function get_coords(addr, callback) {
    $.ajax({
      url: 'http://nominatim.openstreetmap.org/search',
      data: {q: addr, format: 'json'}})
      .done(function(data) {
        if (data.length === 1) {callback(Number(data[0].lat), Number(data[0].lon))}})
  }
  // Java script to display map http://openlayers.org/en/v3.2.1/doc/quickstart.html
  var map_div = $('#map')
  if (map_div) {
    // addr = map_div.data('address')
      window.RentMyThing.addresses.forEach(function(addr) {
        get_coords(addr, function(lat, lon) {
          var pt = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')
          var rental_loc_icon = new ol.Feature({
            geometry: new ol.geom.Point(pt)
          })
          // var renter_loc_icon = new ol.Feature({
          //   // Need to define renter_item_pts
          //   // geometry: new ol.geom.Point(rental_item_pts???)
          // })
          // renter_loc_icon.setStyle(
          //   new ol.style.Style({
          //     image: new ol.style.Icon({
          //       anchor: [0.5, 46],
          //       anchorXUnits: 'fraction',
          //       anchorYUnits: 'pixels',
          //       opacity: 0.75,
          //       src: '/images/green-pin.png'
          //     })
          //   })
          // )

          rental_loc_icon.setStyle(
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 0.75,
                src: '/images/red-pin.png'
              })
            })
          )

          // var markers = new ol.layer.markers( "Markers")

          var map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                title: "Rental Proximity Map",
                source: new ol.source.MapQuest({layer: 'osm'})
              }),
              new ol.layer.Vector({
                source: new ol.source.Vector({
                  features: [
                    rental_loc_icon
                  ]
                })
              })
            ],
            view: new ol.View({
              center: pt,
              zoom: 14
            }),
            controls: ol.control.defaults({
              attributionOptions: {
                collapsible: false
              }}).extend([
                new ol.control.ScaleLine()
              ])
          });
          Window.map = map;
      })
    })
  }
})
