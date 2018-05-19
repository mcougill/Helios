const Uber = require("node-uber");
const express = require("express");
const app = express();

module.exports = function(app) {
  const uber = new Uber({
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    server_token: process.env.server_token,
    redirect_uri: "http://localhost:3000/api/uber/callback",
    name: "Student Project",
    language: "en_US",
    sandbox: true
  });

  //log in and redirect user to authorization URL
  app.get("/api/uber/login", function(request, response) {
    var url = uber.getAuthorizeUrl(["history", "profile", "request", "places"]);
    console.log("hi");
    response.redirect(url);
  });

  //receive redirect and get an access token
  app.get("/api/uber/callback", function(request, response) {
    uber
      .authorizationAsync({ authorization_code: request.query.code })
      .spread(function(
        access_token,
        refresh_token,
        authorizedScopes,
        tokenExpiration
      ) {
        console.log("login success!");
        console.log(access_token + " + " + tokenExpiration);
        // redirect the user back to your actual app
        response.redirect("/api/rides/uberAuth");
      })
      .error(function(err) {
        console.error(err);
      });
  });

  //Price estimate request
  app.post("/api/uber/estimates", function(req, res) {
    // if no query params sent, respond with Bad Request
    if (!req.body.pickup || !req.body.destination) {
      response.sendStatus(400);
    } else {
      uber.estimates
        .getPriceForRouteAsync(
          req.body.pickup.lat,
          req.body.pickup.lng,
          req.body.destination.lat,
          req.body.destination.lng
        )
        .then(function(data) {
          console.log(data);

          var returnedData = {
            rides: []
          };
          data.prices.forEach(function(item) {
            var newRide = {
              company: "Uber",
              type: item.display_name,
              estimate: item.estimate,
              coordinates: req.body,
              minimum: item.low_estimate,
              id: item.product_id
            };

            returnedData.rides.push(newRide);
          });
          res.status(200).json(returnedData);
        })
        .error(function(err) {
          console.error(err);
          response.sendStatus(500);
        });
    }
  });

  app.get("/api/uber/ride", function(req, res) {
    // if no query params sent, respond with Bad Request
    if (!req.body.pickup || !req.body.destination) {
      response.sendStatus(400);
    } else {
      uber.requests
        .createAsync({
          fare_id: null,
          product_id: req.body.product_id,
          start_latitude: req.body.pickup.lat,
          start_longitude: req.body.pickup.lng,
          end_latitude: req.body.destination.lat,
          end_longitude: req.body.desitnation.lng
        })
        .then(function(res) {
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
            setInterval(function() {
              statusArr[counter];
              counter++;
              if (counter === statusArr.length) {
                clearInterval(currentRideStatus);
              }
            }, 10 * 1000);
          }
        })
        .error(function(err) {
          console.error(err);
        });
    }
  });

  //sandbox ride status change
  app.put("/api/uber/status", function(request, response) {
    uber.requests
      .setStatusByIDAsync(requestID, currentRideStatus)
      .then(function(res) {
        console.log(res);
      })
      .error(function(err) {
        console.error(err);
      });
  });

  //receipt
  app.get("/api/uber/receipt", function(request, response) {
    uber.requests
      .getReceiptByIDAsync(uber.client_id)
      .then(function(res) {
        console.log(res);
      })
      .error(function(err) {
        console.error(err);
      });
  });
};
