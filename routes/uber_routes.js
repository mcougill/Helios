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
    redirect_uri: "https://helios-rideshare.herokuapp.com/api/uber/callback",
    name: "Student Project",
    language: "en_US",
    sandbox: true
  });

  //log in and redirect user to authorization URL
  app.get("/api/uber/login", function (request, response) {
    var url = uber.getAuthorizeUrl(["history", "profile", "request", "places", "request_receipt"]);
    console.log("hi");
    response.contentType('application/json');
    var data = JSON.stringify(url);
    response.header('Content-Length', data.length);
    response.end(data);
    console.log('login' + data);
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

      console.log(info.currentType)
      console.log(info.currentpickLat)
      console.log(info.currentpickLng)

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
        .then(function (res) {
          console.log(res);

          //need to store requestID
          const requestID = res.request_id;

          setTimeout(function () {
            uber.requests.setStatusByIDAsync(requestID, 'accepted').then(function (res) {
              console.log(res);

              setTimeout(function () {
                uber.requests.getCurrentAsync().then(function (res) {
                  console.log(res);

                  setTimeout(function () {
                    uber.requests.setStatusByIDAsync(requestID, 'completed').then(function (res) {
                      console.log(res);

                      setTimeout(function () {
                        uber.requests.getReceiptByIDAsync(requestID).then(function (res) {
                          console.log(res);

                          setTimeout(function () {
                            uber.requests.deleteByIDAsync(requestID).then(function (res) {
                              console.log('deleted');
                            })
                          }, 5000)

                        })

                      }, 5000);

                    })

                  }, 5000);

                })

              }, 5000);

            });

          }, 5000)

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

  //receipt
  app.get("/api/uber/delete", function (request, response) {
    uber.requests
      .deleteByIDAsync('dbfc5482-9046-4084-ba37-b278cfd7e5bf')
      .then(function (res) {
        console.log(res);
      })
      .error(function (err) {
        console.error(err);
      });
  });
};
