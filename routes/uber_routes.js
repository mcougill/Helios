const Uber = require("node-uber");
const express = require('express');
const app = express();

module.exports = function (app) {

    const uber = new Uber({
        client_id: 'process.env.client_id',
        client_secret: 'process.env.client_secret',
        server_token: 'process.env.server_token',
        redirect_uri: '',
        name: 'Student Project',
        language: 'en_US',
        sandbox: true
    });




    //SANDBOX 

    // SANDBOX: set driver's availability by product_id
    uber.products.setDriversAvailabilityByIDAsync(uber.client_id, false)
        .then(function (res) {
            console.log(res);
        })
        .error(function (err) {
            console.error(err);
        });


    // SANDBOX: set surge multiplier by product_id
    uber.products.setSurgeMultiplierByIDAsync(uber.client_id, 2.2)
        .then(function (res) {
            console.log(res);
        })
        .error(function (err) {
            console.error(err);
        });

    //SANDBOX: set request status by request_id
    uber.requests.setStatusByIDAsync(uber.client_id, 'accepted')
        .then(function (res) {
            console.log(res);
        })
        .error(function (err) {
            console.error(err);
        });
    //END SANDBOX




    //redirect user to authorization URL
    app.get('/api/login', function (request, response) {
        var url = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places']);
        response.redirect(url);
    });


    //receive redirect and get an access token
    app.get('/api/callback', function (request, response) {
        uber.authorizationAsync({ authorization_code: request.query.code })
            .spread(function (access_token, refresh_token, authorizedScopes, tokenExpiration) {
                // store the user id and associated access_token, refresh_token, scopes and token expiration date
                console.log('New access_token retrieved: ' + access_token);
                console.log('... token allows access to scopes: ' + authorizedScopes);
                console.log('... token is valid until: ' + tokenExpiration);
                console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

                // redirect the user back to your actual app
                response.redirect('/web/index.html');
            })
            .error(function (err) {
                console.error(err);
            });
    });


    const start_latitude = query.lat;
    const start_longitude = query.lng;
    const end_latitude;
    const end_longitude;

    //Price estimate request
    app.get('/api/price', function (request, response) {

        // extract the query from the request URL
        var query = url.parse(request.url, true).query;


        // if no query params sent, respond with Bad Request
        if (!query || !start_latitude || !start_longitude) {
            response.sendStatus(400);
        } else {
            uber.estimates.getPriceForRouteAsync(start_latitude, start_longitude, end_latitude, end_longitude)
                .then(function (res) {
                    console.log(res);
                })
                .error(function (err) {
                    console.error(err);
                    response.sendStatus(500);
                });
        }
    });


    //book Uber
    app.get('/api/book', function (request, response) {

        // extract the query from the request URL
        var query = url.parse(request.url, true).query;


        // if no query params sent, respond with Bad Request
        if (!query || !start_latitude || !start_longitude) {
            response.sendStatus(400);
        } else {
            uber.requests.createAsync({
                "start_latitude": start_latitude,
                "start_longitude": start_longitude,
                "end_latitude": end_latitude,
                "end_longitude": end_longitude
            })
                .then(function (res) {
                    console.log(res);
                })
                .error(function (err) {
                    console.error(err);
                });

        }
    });


    //receipt
    uber.requests.getReceiptByIDAsync(uber.client_id)
        .then(function (res) {
            console.log(res);
        })
        .error(function (err) {
            console.error(err);
        });



};

