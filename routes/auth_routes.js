const router = require('express').Router();
const passport = require('passport');

router.post('/login', function (req, res) {
    res.send('logged in');
});

router.get('/logout', function (req, res) {
    res.send('logged out')
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), function (req, res) {
    // messageObj.user = 'logged in as ' + req.user.dataValues.firstName;
    // console.log('req.user', req.user);
    res.redirect('/landing');
    // res.send(req.user);
});

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile']
}));

router.get('/facebook/redirect', passport.authenticate('facebook'), function (req, res) {
    res.redirect('/landing');
})

module.exports = router;