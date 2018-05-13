module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
        console.log('route ran');
    });
};