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
    redirect_uri: "https://helios-rideshare.herokuapp.com//api/uber/callback",
    name: "Student Project",
    language: "en_US",
    sandbox: true
  });

  //log in and redirect user to authorization URL
  app.get("/api/uber/login", function (request, response) {
    var url = uber.getAuthorizeUrl(["history", "profile", "request", "places"]);
    console.log("hi");
    response.contentType('application/json');
    var data = JSON.stringify(url);
    response.header('Content-Length', data.length);
    response.end(data);
    console.log(data);
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
        console.log("login success!");
        console.log(access_token + " + " + tokenExpiration);
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
          console.log(data);

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
    console.log('post')

    console.log(req.user.dataValues.id);

    db.user.findOne({
      where: {
        id: req.user.dataValues.id
      }
    }).then(function (user) {
      console.log(user.dataValues);

      var info = user.dataValues;



      // if no query params sent, respond with Bad Request

      uber.requests
        .createAsync({
          fare_id: null,
          product_id: info.currentType,
          start_latitude: info.currentpickLat,
          start_longitude: info.currentpickLng,
          end_latitude: info.currentpickLat,
          end_longitude: info.currentpickLng
        })
        .then(function (res) {
          console.log(res);

          //need to store requestID
          const requestID = res.request_id;
          console.log(requestID);
          //lifecycle of uber: ride statuses
          var statusArr = [
            "processing",
            "accepted",
            "arriving",
            "in_progress",
            "driver_canceled",
            "completed"
          ];

          //setTimeout to iterate over ride statuses
          var counter = 0;
          currentRideStatus();

          function currentRideStatus() {
            setInterval(function () {
              statusArr[counter];
              counter++;
              if (counter === statusArr.length) {
                clearInterval(currentRideStatus);
              }
            }, 10 * 1000);
          }
        })
        .error(function (err) {
          console.error(err);
        });

    })






  });

  //sandbox ride status change
  app.put("/api/uber/status", function (request, response) {
    uber.requests
      .setStatusByIDAsync(requestID, currentRideStatus)
      .then(function (res) {
        console.log(res);
      })
      .error(function (err) {
        console.error(err);
      });
  });

  //receipt
  app.get("/api/uber/receipt", function (request, response) {
    uber.requests
      .getReceiptByIDAsync(uber.client_id)
      .then(function (res) {
        console.log(res);
      })
      .error(function (err) {
        console.error(err);
      });
  });
};
