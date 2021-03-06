const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passportGoogleSetup = require('./config/passport_google_setup');
const passportLocalSetup = require('./config/passport_local_setup');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth_routes');
const https = require('https');
const fs = require('fs');

const app = express();

const db = require("./models");

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

require('./routes/html_routes.js')(app);
require('./routes/ride_routes.js')(app);
require('./routes/uber_routes.js')(app);
require('./routes/lyft_routes.js')(app);


const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(`Server started on port ${PORT}`);
    });
});

