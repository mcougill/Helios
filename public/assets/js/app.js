$(document).ready(function () {

  $('#routes').on('click', function () {

    event.preventDefault();

    $.get('/userId', function (userId) {

      console.log(userId);

      var location = {
        pickup: $('#pickupLocation').val().trim(),
        destination: $('#destLocation').val().trim()
      }

      var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location.pickup}&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw`;

      $.ajax({
        url: queryURL,

        method: 'Get'

      }).then(function (res) {

        var pickup = res.results[0].geometry.location

        var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location.destination}&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw`;

        $.ajax({
          url: queryURL,
          method: 'Get'
        }).then(function (res) {

          var destination = res.results[0].geometry.location;

          var serverData = {
            user: userId,
            coordinates: {
              pickup: pickup,
              destination: destination
            }
          }

          console.log(serverData);


          $.post('/api/ride/estimates', serverData, function (estInfo) {

            $('html').html(estInfo);

          });

        });

      });

    });

  });

  $(document).on('click', '.request', function () {

    var url;

    event.preventDefault();

    var requestData = {
      company: $(this).data('company'),
      coordinates: {
        pickup: {
          lat: $(this).data('picklat'),
          lng: $(this).data('picklng')
        },
        destination: {
          lat: $(this).data('destlat'),
          lng: $(this).data('destlng')
        }
      },
      product_id: $(this).data('id')
    }

    console.log(requestData);

    if (requestData.company === 'uber') {
      url = '/api/uber/login';
    } else if (requestData.company === 'lyft') {
      url = '/api/lyft/login';
    }

    $.get(url, function (data) {
      console.log('returned');
      console.log(data);
      window.location = data;
    })

  });

  $('#details').on('click', function () {

    $.get('api/lyft/ride_details', function (data) {
      console.log(data);
    })
  });

});
