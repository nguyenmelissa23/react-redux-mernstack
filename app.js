const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('./utils/passport');
const keys = require('./config/keys');
// const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

/*{ Error Handling }*/
// const AppError = require('./utils/appError');
// const GlobalErrorHandler = require('./controllers/errorController');

const app = express();

// NOTE: 1) MIDDLEWARES: 'use'
if (process.env.NODE_ENV === 'development'){
	app.use(morgan('dev'));
}
app.use(express.json());

// NOTE: we require the path built-in Node module and we tell the app to serve the static build of the React app:
app.use(express.static(path.join(__dirname, 'build'))); // to serve static file.

// app.use(express.static(`${__dirname}/public/`));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Use cookie-session
app.use(cookieSession({
	maxAge: 60*1000, //60 sec
	keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

// NOTE: OUR MIDDLEWARES: apply to every single request. Order matters!

/*{ NOTE: Redirect to Google Auth Routes }*/
app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

// redirect after choosing a google profile to login
app.get('/auth/google/redirect',
  passport.authenticate('google', { 
		successRedirect: '/login/success',
    failureRedirect: '/login/failure' }
));

app.get('/login/success', (req, res, next) => {
	res.status(200).json({
		message: "Google User has successfully logged in!", 
	});
});

app.get('/login/failure', (req, res, next) => {
	res.status(200).json({
		message: "Failed to authenticated Google User. Please try again!", 
	})
});

app.get("/auth/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

/*{ NOTE: MOUNTING THE ROUTES }*/
// app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Order MATTERS! This needs to go after we check all other routes! , '*' = all

//NOTE: This is only applied in case of having the backend as a stand alone.
// app.all('*', (req, res, next) => {
// 	if (req.originalUrl === '/') {
// 		res.status(200).json({
// 			message: `No defined route at http://localhost:8000/. Please visit http://localhost:8000/api/v1/tours or http://localhost:8000/api/v1/users`
// 		})
// 	}
// 	// next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

//NOTE: whenever we pass something in the next() function, it would know that it is an error and skips all the other middlewares and go to the error handling middleware.

// NOTE: ERROR HANDLING MIDDLEWARE
// app.use(GlobalErrorHandler);


module.exports = app;