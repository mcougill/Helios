const router = require('express').Router();
const passport = require('passport');

router.post('/login', passport.authenticate('local', { failureRedirect: '/loginFail' }), function (req, res) {

    res.redirect('/loggedIn');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), function (req, res) {
    // messageObj.user = 'logged in as ' + req.user.dataValues.firstName;
    res.redirect('/loggedIn');
});

module.exports = router;