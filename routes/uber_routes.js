const express = require('express');
const Uber = require("node-uber");

const app = express();

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

//make HTTP requests to available resources
app.get('/api/price', function (request, response) {

    // extract the query from the request URL
    var query = url.parse(request.url, true).query;

    // if no query params sent, respond with Bad Request
    if (!query || !query.lat || !query.lng) {
        response.sendStatus(400);
    } else {
        uber.estimates.getPriceForRouteAsync(query.lat, query.lng)
            .then(function (res) {
                response.json(res);
            })
            .error(function (err) {
                console.error(err);
                response.sendStatus(500);
            });
    }
});

