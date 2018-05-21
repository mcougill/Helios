const Uber = require("node-uber");
const express = require("express");
const app = express();
const db = require('./../models')
const request = require('request');

module.exports = function (app) {

  require('./html_routes.js')(app);

  const uber = new Uber({
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    server_token: process.env.server_token,
    //redirect_uri: "https://helios-rideshare.herokuapp.com/api/uber/callback",
    redirect_uri: "http://localhost:3000/api/uber/callback",
    name: "Student Project",
    language: "en_US",
    sandbox: true
  });

  //log in and redirect user to authorization URL
  app.get("/api/uber/login", function (request, response) {
    var url = uber.getAuthorizeUrl(["history", "profile", "request", "places", "request_receipt"]);
    response.contentType('application/json');
    var data = JSON.stringify(url);
    response.header('Content-Length', data.length);
    response.end(data);
  });

  //receive redirect and get an access token
  app.get("/api/uber/callback", function (request, response) {
    uber
      .authorizationAsync({ authorization_code: request.query.code })
      .spread(function (
        access_token,
        refresh_token,
        authorizedScopes,
        tokenExpiration
      ) {

        // redirect the user back to your actual app
        response.redirect("/api/uber/ride");
      })
      .error(function (err) {
        console.error(err);
      });
  });

  //Price estimate request
  app.post("/api/uber/estimates", function (req, res) {
    // if no query params sent, respond with Bad Request
    if (!req.body.coordinates.pickup || !req.body.coordinates.destination) {
      response.sendStatus(400);
    } else {
      uber.estimates.getPriceForRouteAsync(
        req.body.coordinates.pickup.lat,
        req.body.coordinates.pickup.lng,
        req.body.coordinates.destination.lat,
        req.body.coordinates.destination.lng
      )
        .then(function (data) {


          var returnedData = {
            rides: []
          };
          data.prices.forEach(function (item) {
            var newRide = {
              company: "uber",
              type: item.display_name,
              estimate: item.estimate,
              coordinates: req.body,
              minimum: item.low_estimate,
              id: item.product_id,
              uber: true,
              user: req.body.user
            };

            returnedData.rides.push(newRide);
          });
          res.status(200).json(returnedData);
        })
        .error(function (err) {
          console.error(err);
          response.sendStatus(500);
        });
    }

  });


  app.get("/api/uber/ride", function (req, res) {

    db.user.findOne({
      where: {
        id: req.user.dataValues.id
      }
    }).then(function (user) {


      var info = user.dataValues;


      // if no query params sent, respond with Bad Request

      uber.requests
        .createAsync({
          fare_id: null,
          product_id: info.currentType,
          start_latitude: info.currentpickLat,
          start_longitude: info.currentpickLng,
          end_latitude: info.currentdestLat,
          end_longitude: info.currentdestLng
        })
        .then(function (data) {

          //need to store requestID
          const requestID = data.request_id;

          uber.requests.setStatusByIDAsync(requestID, 'completed')
          .then(function(data){

            uber.requests.getReceiptByIDAsync(requestID).then(function(data){

              res.redirect(`/receipt/${data.total_charged}`)

            })
          })

        })
        .error(function (err) {
          console.error(err);
        });

    });

  });


  //sandbox ride status change
  app.get("/api/uber/status", function (request, response) {
    uber.requests.getCurrentAsync()
      .then(function (res) {
        console.log(res);
      })
      .error(function (err) {
        console.error(err);
      });
  });

  //delete
  app.get("/api/uber/delete", function (request, response) {
    uber.requests
      .deleteByIDAsync('3d034163-3d5e-499c-8502-b970bcd6c21b')
      .then(function (res) {
        console.log(res);
      })
      .error(function (err) {
        console.error(err);
      });
  });
};
