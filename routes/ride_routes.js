const request = require('request');

module.exports = function(app){

    app.post('/api/ride/estimates', function (req, res){

        var lyftOptions = {
            method: 'POST',
            url: 'http://localhost:3000/api/lyft/estimates',
            body: req.body,
            json: true
        }

        request(lyftOptions, function(error, lyftResponse, lyftInfo){
            if (error) throw error

            console.log(lyftInfo)

            var uberOptions = {
                method: 'POST',
                url: 'http://localhost:3000/api/uber/estimates',
                body: req.body,
                json: true
            }

            request(uberOptions, function (error, uberResponse, uberInfo){
                if (error) throw error

                console.log(uberInfo)

                uberInfo.rides.forEach(function(item){
                    lyftInfo.rides.push(item);
                });

                function swap(array, i, j) {
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                  }
                  
                  
                function bubbleSortBasic(array) {
                    for(var i = 0; i < array.length; i++) {
                      for(var j = 1; j < array.length; j++) {
                        if(array[j - 1].minimum > array[j].minimum) {
                          swap(array, j - 1, j);
                        }
                      }
                    }
                    return array;
                  }

                bubbleSortBasic(lyftInfo.rides)

                if(lyftInfo.rides.length > 0){
                    res.render('cards', lyftInfo);
                    //res.json(lyftInfo);
                } else {
                    res.status(400).render('cards', {noRides:true});
                }
            });
        });
    });

    app.post('/api/ride/request', function(rideReq,rideRes){

        console.log(rideReq.body.company);

        if (rideReq.body.company === 'lyft'){
            
            var options ={
                method: 'GET',
                url: 'http://localhost:3000/api/lyft/login' 
            }

            request(options, function (error, response, body){
                console.log(body);

                app.get('/api/rides/lyftAuth', function (req, res){

                    var options = {
                        method: 'POST',
                        url: '/api/lyft/sandbox/request',
                        body: rideReq,
                        json: true
                    }

                    request(options, function(error, response, body){
                        res.render('ride', body);
                    })
                })
            })

            // If ride chosen is an Uber, first verify user
        } else if (rideReq.body.company === 'uber'){
            var options = {
                method: 'GET',
                url: 'http://localhost:3000/api/uber/login'
            }

            request(options, function (error, response, body){

                if (error) throw error

                //Once user has been verified, format info for ride request and send
                app.get('/api/rides/uberAuth', function (req, res){

                    var options = {
                        method: 'POST',
                        url: 'http://localhost:3000/api/uber/ride',
                        body: {
                           product_id: rideReq.body.product_id,
                           pickup: rideReq.body.pickup,
                           destination: rideReq.body.destination 
                        },
                        json: true
                    };

                    request(options, function (error, response, body){
                        console.log(body);
                    })

                });
            });
        };

    });

    // Listening to status changes from both companies
    app.post('/webhooks', function (req, res){

        console.log(req.body);

        // If statement to determine what service is being used and redering page from status update
        if (req.body.hasOwnProperty('href')){

            res.render('status', {status: req.body.event.status})

        } else if (req.body.hasOwnProperty('resource_href')){

            res.render('status', {status: req.body.meta.status})

        }

    })  

};