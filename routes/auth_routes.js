const router = require('express').Router();
const passport = require('passport');

router.post('/login', passport.authenticate('local', {failureRedirect: '/auth/loginFail'}), function (req, res) {
    console.log('the login route ran!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    res.redirect('/');
});

router.get('/loginFail', function (req, res) {
    let loginFail = {
        message: 'Login failed. User/Password not found.'
    };
    
    res.redirect('/loginFail');
});

router.get('/logout', function (req, res) {
    console.log(req.user);
    console.log('logout ran//////////////////////////////');
    req.logout();
    res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), function (req, res) {
    // messageObj.user = 'logged in as ' + req.user.dataValues.firstName;
    // console.log('req.user', req.user);
    res.redirect('/');
    // res.send(req.user);
});

module.exports = router;