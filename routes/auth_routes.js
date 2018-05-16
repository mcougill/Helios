const router = require('express').Router();

router.post('/login', function (req, res) {
    res.send('logged in');
});

router.get('/logout', function (req, res) {
    res.send('logged out')
});

router.get('/google', function (req, res) {
    res.send('logging in with Google');
});

router.get('/facebook', function (req, res) {
    res.send('logging in with facebook');
})

module.exports = router;