const geocoder = require('google-geocoder');
const geo = geocoder({
    key: 'AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw'
});

module.exports = function (app) {

    app.get('/api/maps', function (req, res) {

        geo.find('KIPP Dream', function (err, data) {

            var coordinates = {
                pickup: data[0].location
            }

            if (data) {
                geo.find('1230 Prince St', function (err, data) {

                    coordinates.destination = data[0].location
                    
                    res.status(200).json(coordinates);

                });
            };

        });
    });

};