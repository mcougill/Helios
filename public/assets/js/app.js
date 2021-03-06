$(document).ready(function () {

  $('#routes').on('click', function () {

    event.preventDefault();

    // Calling the current users Id to read/write to the db
    $.get('/userId', function (userId) {


      var location = {
        pickup: $('#pickupLocation').val().trim(),
        destination: $('#destLocation').val().trim()
      }

      var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location.pickup}&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw`;

      // Returning coordinates of the pickup location
      $.ajax({
        url: queryURL,

        method: 'Get'

      }).then(function (res) {

        var pickup = res.results[0].geometry.location

        var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location.destination}&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw`;

        // Returning coordinates of the destination location
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


          // Sending all data to the ride estimates to ping both services
          $.post('/api/ride/estimates', serverData, function (estInfo) {

            // Writing to the page the info that returns
            $('html').html(estInfo);

          });

        });

      });

    });

  });

  $(document).on('click', '.request', function () {

    // Global url so that if can be either uber or lyft
    var url;

    event.preventDefault();

    if ($(this).data('company') === 'uber') {

      $.post('/api/ride/ride_type', {type:$(this).data('id')}, function (data) {

        url = '/api/uber/login';

        // Send to the authentication
        $.get(url, function (data) {
       
          window.location = data;
        });

      });

      url = '/api/uber/login';

    } else if ($(this).data('company') === 'lyft') {

      $.post('/api/ride/ride_type', {type:$(this).data('type')}, function (data) {

        url = '/api/lyft/login';

        // Send to the authentication
        $.get(url, function (data) {
          
          window.location = data;

        });

      });
    }

  });

});
