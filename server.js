const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

const db = require("./models");

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/uber_routes.js')(app);
// require('./routes/lyft_routes.js')(app);
require('./routes/html_routes.js')(app);
require('./routes/maps_routes.js')(app);

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(`Server started on port ${PORT}`);
    });
});