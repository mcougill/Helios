const geocoder = require('google-geocoder');

module.exports = function (app) {

    app.get('/api/maps', function (req, res) {

        const geo = geocoder({
            key: 'AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw'
        });

        geo.find(req.body.address, function (err, data) {

            if (err) throw (err)

            res.json(data[0].location);

            console.log('Coordinates returned');

        });
    })
};