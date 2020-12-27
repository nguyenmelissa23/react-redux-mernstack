const express = require('express');

const passport = require('../utils/passport');
// const userController = require('../controllers/userController');

const router = express.Router();

router
	.post('auth/google/redirect', passport.authenticate('google'), (req, res) => {
		res.send(req.user);
		res.send('you reached the redirect URI');
	});

module.exports = router;