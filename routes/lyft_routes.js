const lyft = require('node-lyft');
var request = require("request");
const db = require("./../models");

module.exports = function (app) {

    require('./html_routes.js')(app);

    var accountAccess;

    app.post('/api/lyft/estimates', function (req, res) {

        let defaultClient = lyft.ApiClient.instance;

        let clientAuth = defaultClient.authentications['Client Authentication'];
        clientAuth.accessToken = process.env.lyft_token;


        let apiInstance = new lyft.PublicApi();
        let destination = req.body.coordinates.destination
        let pickup = req.body.coordinates.pickup

        let opts = {
            'endLat': destination.lat,
            'endLng': destination.lng,
        };

        // Calling the API with the necessary info
        apiInstance.getCost(pickup.lat, pickup.lng, opts).then(function (data) {
            var returnedData = {
                rides: []
            };

            // Iterating over the returned array to format
            data.cost_estimates.forEach(function(item){
                var newRide = {
                    company: 'lyft',
                    type: item.display_name,
                    estimate: `$${(item.estimated_cost_cents_min/100).toFixed(2)}-${(item.estimated_cost_cents_max/100).toFixed(2)}`,
                    coordinates: req.body,
                    minimum: parseFloat((item.estimated_cost_cents_min/100).toFixed(2)),
                    id: null,
                    uber: false,
                    user: req.body.user
                }
                returnedData.rides.push(newRide);
            })

            // Sending formatted data back to client
            res.status(200).json(returnedData);

        }, function (error) {
            console.error(error);
        });

    })

    app.get('/api/lyft/login', function (req, res){

        var url = `https://api.lyft.com/oauth/authorize?client_id=${process.env.lyft_id}&scope=public%20profile%20rides.read%20rides.request%20offline&state=active&response_type=code`

        res.send(url);

    });


    app.get('/api/lyft/redirect', function(req, res){
        console.log(req.query.code);
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