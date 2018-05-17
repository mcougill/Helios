const lyft = require('node-lyft');
var request = require("request");
const db = require("./../models");

module.exports = function (app) {

    var accountAccess;

    app.post('/api/lyft/routes', function (req, res) {

        let defaultClient = lyft.ApiClient.instance;

        let clientAuth = defaultClient.authentications['Client Authentication'];
        clientAuth.accessToken = process.env.lyft_token;


        let apiInstance = new lyft.PublicApi();
        let destination = req.body.destination
        let pickup = req.body.pickup

        let opts = {
            'endLat': destination.lat,
            'endLng': destination.lng,
        };

        apiInstance.getCost(pickup.lat, pickup.lng, opts).then(function (data) {
            var returnedData = {
                rides: []
            };

            data.cost_estimates.forEach(function(item){
                var newRide = {
                    company: 'Lyft',
                    type: item.display_name,
                    estimate: `$${(item.estimated_cost_cents_min/100).toFixed(2)}-${(item.estimated_cost_cents_max/100).toFixed(2)}`,
                    coordinates: req.body
                }
                returnedData.rides.push(newRide);
            })
            res.status(200).json(returnedData);
        }, function (error) {
            console.error(error);
        });

    })

    app.post('/api/lyft/sandbox/request', function (req, res) {

        var auth = 'Basic ' + new Buffer(`${process.env.lyft_id}:SANDBOX-${process.env.lyft_secret}`).toString('base64');

        var options = {
            method: 'POST',
            url: 'https://api.lyft.com/oauth/token',
            headers:
                {
                    'Postman-Token': '4e103d91-c50e-41d8-860e-9df78056e223',
                    'Cache-Control': 'no-cache',
                    'Authorization': auth,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            body: '{"grant_type": "client_credentials", "scope": "public rides.read rides.request"}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);

            accountAccess = JSON.parse(body).access_token;

            console.log(accountAccess);

            db.user.create({
                firstName: 'Test',
                lastName: 'Person',
                currentToken: accountAccess
            });

            var options = {
                method: 'POST',
                url: 'https://api.lyft.com/v1/rides',
                headers:
                    {
                        'Postman-Token': '36c0947f-1006-4b71-b615-d26618d23419',
                        'Cache-Control': 'no-cache',
                        Authorization: `Bearer ${accountAccess}`,
                        'Content-Type': 'application/json'
                    },
                body:
                    {
                        ride_type: 'lyft',
                        origin: { lat: 37.77663, lng: -122.39227 },
                        destination:
                            {
                                lat: 37.771,
                                lng: -122.39123,
                                address: 'Mission Bay Boulevard North'
                            }
                    },
                json: true
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                console.log(body);

                res.status(200).json(body);

                db.user.update({
                    currentRide: body.ride_id
                }, {
                    where: {
                        firstName: 'Test'
                    }
                });

            });

        });

    });

    app.get('/api/lyft/ride_details', function (req, res) {

        db.user.findOne({
            where: {
                firstName: 'Test'
            }
        }).then(function (user) {
            console.log(user.dataValues);

            var options = {
                method: 'GET',
                url: `https://api.lyft.com/v1/rides/${user.dataValues.currentRide}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.dataValues.currentToken}`
                }
            };

            request(options, function (error, response, body) {

                console.log(JSON.parse(body));

                res.json(body);
            });

        });
    });

};