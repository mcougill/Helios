const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passportGoogleSetup = require('./config/passport_google_setup');
const passportFacebookSetup = require('./config/passport_facebook_setup');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth_routes');
// const session = require('express-session');

const app = express();

// const sess = {
//     secret: process.env.expressSessionCookieKey,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {}
// };

const db = require("./models");

// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1);
//     sess.cookie.secure = true;
// }

// app.use(session(sess));
// app.use(function (req, res, next) {
//     if (!req.session.views) {
//         req.session.views = {};
//     }
//     next();
// });

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

require('./routes/uber_routes.js')(app);
// require('./routes/lyft_routes.js')(app);
require('./routes/html_routes.js')(app);
require('./routes/maps_routes.js')(app);

const PORT = process.env.PORT || 3000;

// db.sequelize.sync().then(function () {
//     app.listen(PORT, function () {
//         console.log(`Server started on port ${PORT}`);
//     });
// });

/////////////////////////////////////////////////////////////////////////////
// const express = require('express')
// const app = express()
const https = require('https')
const fs = require('fs')
// const port = 3000

app.get('/', (req, res) => {
  res.send('WORKING!')
})

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}
const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('server running at ' + PORT)
})
