<<<<<<< HEAD
$(document).ready(function() {
  // Closing tag for document.ready
=======

$(document).ready(function () {

    $('#routes').on('click', function () {

        event.preventDefault();

        var location = {
            pickup: 'KIPP Dream',
            destination: '1230 Prince St'
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
            }).then(function(res){

                coordinates.destination = res.results[0].geometry.location;

                $.post('api/lyft/routes', coordinates, function(lyftInfo){
                    console.log(lyftInfo.cost_estimates[0]);
                });

            });
        
        });

    });



    $('#request').on('click', function () {

        $.post('lyft/request', function (data) {
            console.log(data);
        })
    })

>>>>>>> a1501f9deb1d8e0a17367847b4cb8fa89ce6cb47
});

