const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

const port = process.env.PORT || 3000;

require('./routes/maps_routes.js')(app);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});