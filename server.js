const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

const uber = require('./routes/uber_routes.js');
const lyft = require('./routes/lyft_routes.js');
const maps = require('./routes/maps_routes.js');
const html = require('./routes/html_routes');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000;

require('./routes/maps_routes.js')(app);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});