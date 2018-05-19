$(document).ready(function () {

  $('#routes').on('click', function () {

    console.log('yes');

    event.preventDefault();

    var location = {
      pickup: $('#pickupLocation').val().trim(),
      destination: $('#destLocation').val().trim()
    }

    var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location.pickup}&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw`;

    $.ajax({
      url: queryURL,
      method: 'Get'

    }).then(function (res) {

      var coordinates = {
        pickup: res.results[0].geometry.location
      }

      var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location.destination}&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw`;

      $.ajax({
        url: queryURL,
        method: 'Get'
      }).then(function (res) {

        coordinates.destination = res.results[0].geometry.location;

        $.post('/api/ride/estimates', coordinates, function (estInfo) {

          $('html').html(estInfo);

        });

      });

    });

  });

  $('.request').on('click', function () {

    console.log('yes')

    event.preventDefault();

    var requestData = {
      company : $(this).data('company'),
      coordinates : {
        pickup: {
          lat: $(this).data('pickLat'),
          lng: $(this).data('pickLng')
        },
        destination: {
          lat: $(this).data('destLat'),
          lng: $(this).data('destLng')
        }
      },
      product_id:$(this).data('id')
    }

    console.log(requestData);

    /* $.post('/api/lyft/sandbox/request', function (data) {
      console.log(data);
    }) */
  });

  $('#details').on('click', function () {

    $.get('api/lyft/ride_details', function (data) {
      console.log(data);
    })
  });

});
