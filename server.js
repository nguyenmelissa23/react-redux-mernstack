//auto-install to install all requires.
//npm install mongoose dotenv
const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', err => { 
	console.log(err.name, err.message);
	console.log('UNCAUGHT EXCEPTION: Shutting Down...');
	process.exit(1);
})

//1. Config file for NODE 
// review file called 'config-example.env' for file set up.
dotenv.config({path: './config/config.env'});
// console.log(process.env);

//2. Set up DB info
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD).replace('<dbname>', process.env.DATABASE_NAME);
// console.log(DB);
//3. Connect to DB
mongoose
	.connect(DB, {
		useNewUrlParser: true, 
		useCreateIndex: true, 
		useFindAndModify: false, 
		useUnifiedTopology: true
	})
	.then( conn => { console.log('DB connected successfully')});

//4. START SERVER:
const app = require('./app');
const port = 8000 || process.env.PORT ;
const server = app.listen(port, () => {
	console.log(`App running at http://localhost:${port}/ ...`)
});

// 4. HANDLING PROMISE REJECTION ERRORS
process.on('unhandledRejection', err => {
	console.log(err.name, err.message);
	console.log('UNHANDLER REJECTION: Shutting Down...');
	server.close(() => {
		process.exit(1);
	})
});

/*{
	* Create new MongoDB at cloud.mongodb.com *
	* Accessing DB from MongoDB Compass or mongo shell in the terminal *
	* To send API requests during development, use Postman *
}*/