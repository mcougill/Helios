const request = require('request');
const db = require("./../models");

module.exports = function (app) {

    require('./html_routes.js')(app);

    app.post('/api/ride/estimates', function (req, res) {

        var lyftOptions = {
            method: 'POST',
            url: 'http://localhost:3000/api/lyft/estimates',
            body: req.body,
            json: true
        }

        // First make the request to lyft and recieve formatted data back
        // https://helios-rideshare.herokuapp.com/api/lyft/estimates
        request(lyftOptions, function (error, lyftResponse, lyftInfo) {
            if (error) throw error

            

            var uberOptions = {
                method: 'POST',
                url: 'http://localhost:3000/api/uber/estimates',
                body: req.body,
                json: true
            }

            // Request to uber and receive formatted data back
            // https://helios-rideshare.herokuapp.com/api/uber/estimates
            request(uberOptions, function (error, uberResponse, uberInfo) {
                if (error) throw error

        

                // Push uber data into array returned by lyft
                uberInfo.rides.forEach(function (item) {
                    lyftInfo.rides.push(item);
                });

                function swap(array, i, j) {
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }

                // Run a bubble sort to arrange by price
                function bubbleSortBasic(array) {
                    for (var i = 0; i < array.length; i++) {
                        for (var j = 1; j < array.length; j++) {
                            if (array[j - 1].minimum > array[j].minimum) {
                                swap(array, j - 1, j);
                            }
                        }
                    }
                    return array;
                }

                bubbleSortBasic(lyftInfo.rides)

                if (lyftInfo.rides.length > 0) {

                    lyftInfo.user = true;

                    // Write the current coordinates to the database at the user's location
                    db.user.update({
                        currentpickLat: req.body.coordinates.pickup.lat,
                        currentpickLng: req.body.coordinates.pickup.lng,
                        currentdestLat: req.body.coordinates.destination.lat,
                        currentdestLng: req.body.coordinates.destination.lng,
                    }, {
                            where: {
                                id: req.body.user
                            }
                        }).then(function (data) {

                            

                            // Render the cards page
                            res.status(200).render('cards', lyftInfo);
                        })


                } else {
                    res.status(400).render('cards', { noRides: true });
                }
            });
        });
    });


    app.post('/api/ride/ride_type', function(req, res){

      
        db.user.update({
            currentType: req.body.type
        }, {
            where: {
                id: req.user.dataValues.id
            }
        }).then(function(data){
            res.status(200).send('updated')
        })
    })
  
    app.get('/webhooks/:status', function(req, res){
        res.redirect(`/status/${req.params.status}`);
    })

};