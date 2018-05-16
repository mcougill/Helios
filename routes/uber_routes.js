const Uber = require("node-uber");
const express = require('express');
const app = express();

module.exports = function (app) {

    const uber = new Uber({
        client_id: 'process.env.client_id',

        client_secret: 'process.env.client_secret',
        
        server_token: 'process.env.server_token',
      
        redirect_uri: 'http://localhost:3000/api/callback',
        name: 'Student Project',
        language: 'en_US',
        sandbox: true
    });



    //redirect user to authorization URL
    app.get('/api/login', function (request, response) {
        var url = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places']);
        response.redirect(url);
    });


    //receive redirect and get an access token
    app.get('/api/callback', function (request, response) {
        uber.authorizationAsync({ authorization_code: request.query.code })
            .spread(function (access_token, refresh_token, authorizedScopes, tokenExpiration) {
                console.log("login success!");
                // redirect the user back to your actual app
                response.redirect('/');
            })
            .error(function (err) {
                console.error(err);
            });
    });


    //placeholder testing variables
    const start_latitude = 29.7497;
    const start_longitude = -95.3773;
    const end_latitude = 29.743151
    const end_longitude = -95.388720;
    const product_id = "9c0fd086-b4bd-44f1-a278-bdae3cdb3d9f";



    //Price estimate request
    app.get('/api/price', function (request, response) {

        // if no query params sent, respond with Bad Request
        if (!start_latitude || !start_longitude) {
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



    //NOT WORKING YET 
    //book Uber
    app.get('/api/book', function (request, response) {

        // if no query params sent, respond with Bad Request
        if (!start_latitude || !start_longitude) {
            response.sendStatus(400);
        } else {
            uber.requests.createAsync({
                "fare_id": null,
                "product_id": "9c0fd086-b4bd-44f1-a278-bdae3cdb3d9f",
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
    app.get('/api/receipt', function (request, response) {
        uber.requests.getReceiptByIDAsync(uber.client_id)
            .then(function (res) {
                console.log(res);
            })
            .error(function (err) {
                console.error(err);
            })

    });



}
