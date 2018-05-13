const express = require('express');
const Uber = require("node-uber");
const app = express();

//initialize Uber object
const uber = new Uber({
    client_id: 'process.env.client_id',
    client_secret: 'process.env.client_secret',
    server_token: 'process.env.server_token',
    redirect_uri: '',
    name: 'Student Project',
    language: 'en_US',
});


//redirect user to authorization URL
app.get('/api/login', function (request, response) {
    var url = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places', 'all_trips']);
    //redirect to user login to approve access to Uber account 
    response.redirect(url);
});

//receive redirect and conver authorization code into OAuth access token
app.get('/api/callback', function (request, response) {
    uber.authorizationAsync({ authorization_code: request.query.code })
        .spread(function (access_token, refresh_token, authorizedScopes, tokenExpiration) {
            // store the user id and associated access_token, refresh_token, scopes and token expiration date
            console.log('New access_token retrieved: ' + access_token);
            console.log('... token allows access to scopes: ' + authorizedScopes);
            console.log('... token is valid until: ' + tokenExpiration);
            console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

            // redirect the user back to your actual app
            response.redirect('../public.index.html');
        })
        .error(function (err) {
            console.error(err);
        });
});

//make HTTP requests to available resources
app.get('/api/price', function (request, response) {

    // extract the query from the request URL
    const query = url.parse(request.url, true).query;
    const start_latitude = query.lat;
    const start_longitude = query.lng;
    const end_latitude;
    const end_longitude;

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

module.exports = uber;

