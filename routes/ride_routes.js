const request = require('request');
const db = require("./../models")

module.exports = function (app) {

    app.post('/api/ride/estimates', function (req, res) {

        var lyftOptions = {
            method: 'POST',
            url: 'https://helios-rideshare.herokuapp.com/api/lyft/estimates',
            body: req.body.coordinates,
            json: true
        }

        request(lyftOptions, function (error, lyftResponse, lyftInfo) {
            if (error) throw error

            console.log(lyftInfo)

            var uberOptions = {
                method: 'POST',
                url: 'https://helios-rideshare.herokuapp.com/api/uber/estimates',
                body: req.body.coordinates,
                json: true
            }

            request(uberOptions, function (error, uberResponse, uberInfo) {
                if (error) throw error

                console.log(uberInfo)

                uberInfo.rides.forEach(function (item) {
                    lyftInfo.rides.push(item);
                });

                function swap(array, i, j) {
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }


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
                    res.status(200).render('cards', lyftInfo);

                    if (req.body.user) {

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
                                console.log(data);
                            })
                            
                    } else {
                        
                        db.user.create({
                            currentpickLat: req.body.coordinates.pickup.lat,
                            currentpickLng: req.body.coordinates.pickup.lng,
                            currentdestLat: req.body.coordinates.destination.lat,
                            currentdestLng: req.body.coordinates.destination.lng,
                        }).then(function(data){
                            console.log(data);
                        })

                    }

                } else {
                    res.status(400).render('cards', { noRides: true });
                }
            });
        });
    });



    // Listening to status changes from both companies
    app.post('/webhooks', function (req, res) {

        console.log(req.body);

        // If statement to determine what service is being used and redering page from status update
        if (req.body.hasOwnProperty('href')) {

            res.render('status', { status: req.body.event.status })

        } else if (req.body.hasOwnProperty('resource_href')) {

            res.render('status', { status: req.body.meta.status })

        }

    })

};