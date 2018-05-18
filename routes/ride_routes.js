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
                    res.status(200).json(lyftInfo).render('cards', lyftInfo);
                } else {
                    res.status(400).render('cards', {noRides:true});
                }
            });
        });
    });

    app.post('/api/ride/request', function(req,res){

        var options ={
            method: 'POST',
            body: req.body,
            json: true
        }

        if (req.body.company === 'Lyft'){
            options.url = 'http://localhost:3000/api/lyft/sandbox/request'
        } else if (req.body.company === 'Uber'){
            options.url = 'http://localhost:3000/api/uber/request'
        }
    })
};