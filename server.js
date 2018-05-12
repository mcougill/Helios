const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
// const session = require('express-session');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});