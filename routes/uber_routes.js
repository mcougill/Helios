const Uber = require("node-uber");
const express = require('express');
const app = express();


module.exports = function (app) {

    const uber = new Uber({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        server_token: process.env.server_token,
        redirect_uri: 'http://localhost:3000/api/uber/callback',
        name: 'Student Project',
        language: 'en_US',
        sandbox: true
    });



    //log in and redirect user to authorization URL
    app.get('/api/uber/login', function (request, response) {
        var url = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places']);
        console.log("hi");
        response.redirect(url);
    });


    //receive redirect and get an access token
    app.get('/api/uber/callback', function (request, response) {
        uber.authorizationAsync({ authorization_code: request.query.code })
            .spread(function (access_token, refresh_token, authorizedScopes, tokenExpiration) {
                console.log("login success!");
                console.log(access_token + " + " + tokenExpiration);
                // redirect the user back to your actual app
                response.redirect('/');
            })
            .error(function (err) {
                console.error(err);
            });
    });




    //Price estimate request
    app.post('/api/uber/routes', function (req, res) {

        // if no query params sent, respond with Bad Request
        if (!req.body.pickup || !req.body.destination) {
            response.sendStatus(400);
        } else {
            uber.estimates.getPriceForRouteAsync(req.body.pickup.lat, req.body.pickup.lng, req.body.destination.lat, req.body.destination.lng)
                .then(function (data) {

                    console.log(data);

                    var returnedData = {
                        rides: []
                    }
                    data.prices.forEach(function (item) {
                        var newRide = {
                            company: 'Uber',
                            type: item.display_name,
                            estimate: item.estimate,
                            coordinates: req.body
                        }

                        returnedData.rides.push(newRide);
                    })
                    res.status(200).json(returnedData);
                })
                .error(function (err) {
                    console.error(err);
                    response.sendStatus(500);
                });
        }
    });



    //placeholder variables
    const product_id = "9c0fd086-b4bd-44f1-a278-bdae3cdb3d9f";
    const start_latitude = 29.752554;
    const start_longitude = -95.370401;


    //request uber
    app.get('/api/uber/request', function (request, response) {

        // if no query params sent, respond with Bad Request
        //if (!req.body.pickup || !req.body.destination) {
        if (!start_latitude || !start_longitude) {
            response.sendStatus(400);
        } else {
            uber.requests.createAsync({
                "fare_id": null,
                //product_id (i.e uberX) -- will need to pull from ride estimate 
                "product_id": "9c0fd086-b4bd-44f1-a278-bdae3cdb3d9f",
                /*  "start_latitude": req.body.pickup.lat,
                 "start_longitude": req.body.pickup.lng,
                 "end_latitude": req.body.destination.lat,
                 "end_longitude": req.body.destination.lng, */
                "start_latitude": 29.886034,
                "start_longitude": -95.514986,
                "end_latitude": 29.829653,
                "end_longitude": -95.346332
            })
                .then(function (res) {
                    console.log(res);

                    //need to store requestID
                    const requestID = res.request_id;
                    console.log(requestID);
                })
                .error(function (err) {
                    console.error(err);
                });

        }
    }); 

  

   //lifecycle of uber: ride statuses 
    const statusArr = ['processing', 'accepted', 'arriving', 'in_progress', 'driver_canceled', 'completed'];

    //setTimeout to iterate over ride statuses
    var counter = 0;
    var currentRideStatus = setInterval(function () {
        statusArr[counter];
        counter++;
        if (counter === statusArr.length) {
            clearInterval(currentRideStatus);
        }
    }, 5 * 1000);


    //sandbox ride status change
    app.put('/api/uber/status', function (request, response) {
        uber.requests.setStatusByIDAsync(requestID, currentRideStatus)
            .then(function (res) {
                console.log(res);
            })
            .error(function (err) {
                console.error(err);
            });
    })



    //receipt
    app.get('/api/uber/receipt', function (request, response) {
        uber.requests.getReceiptByIDAsync(uber.client_id)
            .then(function (res) {
                console.log(res);
            })
            .error(function (err) {
                console.error(err);
            })

    });



}
