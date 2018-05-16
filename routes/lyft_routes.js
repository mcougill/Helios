const lyft = require('node-lyft');
var request = require("request");

module.exports = function (app) {

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
            console.log(data);
            res.status(200).json(data);
        }, function (error) {
            console.error(error);
        });

    })

    app.post('/lyft/request', function (req, res) {

        var user = process.env.lyft_id;
        var password = process.env.lyft_secret;

        /* var auth = 'Basic ' + new Buffer(user + ':' + 'SANDBOX-' + password).toString('base64');

        console.log(auth); */

        var options = {
            method: 'POST',
            url: 'https://api.lyft.com/oauth/token',
            headers:
                {
                    'Postman-Token': '4e103d91-c50e-41d8-860e-9df78056e223',
                    'Cache-Control': 'no-cache',
                    auth: {
                        username: user,
                        password: `SANDBOX-${password}`
                    },
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            body: '{"grant_type": "client_credentials", "scope": "public rides.read rides.request"}'
        };

        console.log(options);

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(JSON.parse(body));

            var access = JSON.parse(body).access_token;

            console.log(access);

            var options = {
                method: 'POST',
                url: 'https://api.lyft.com/v1/rides',
                headers:
                    {
                        'Postman-Token': '36c0947f-1006-4b71-b615-d26618d23419',
                        'Cache-Control': 'no-cache',
                        Authorization: `Bearer ${access}`,
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
            });



        });

    });

};