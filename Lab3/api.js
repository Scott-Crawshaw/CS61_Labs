/* 	Scott Crawshaw
    Dartmouth CS61
    Spring 2020
    Lab 3

	Based on code written by Tim Pierson, Dartmouth College Department of Computer Science, Spring 2020
*/

var express=require('express');
let mysql = require('mysql');
const bodyParser = require('body-parser'); //allows us to get passed in api calls easily
var app=express();

// get config
var env = 'local';
var config = require('./config')[env]; //read credentials from config.js

//use bcrypt
const bcrypt = require('bcrypt');

//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({
		host     : config.database.host, 
		user     : config.database.user, 
		password : config.database.password, 
		database : config.database.schema 
	});
	connection.connect();
	next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console
router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});

// Main Page
router.get("/",function(req,res){
	res.send("Scott Crawshaw, Dartmouth CS61, Spring 2020, Lab 3");
});

// Get all Inspectors, or just yourself if not admin
router.get("/api/inspectors",function(req,res){
	global.connection.query('SELECT isAdmin, Password FROM Employees WHERE Username = ?', [req.query.loginUsername] ,function (error, results, fields) {
		if (error){
			//Server error
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length == 1 && bcrypt.compareSync(req.query.loginPassword, results[0]['Password'])){
			if(results[0]['isAdmin']){
				// Is an admin
				global.connection.query('SELECT * FROM Employees', function(error1, results1, fields1){
					if (error1){
						res.send(JSON.stringify({"status": 500, "error": error1, "response": null}));
						return;
					}
					res.send(JSON.stringify({"status": 200, "error": null, "response": results1}));
				});
			}
			else{
				// Is not an admin
				global.connection.query('SELECT * FROM Employees WHERE Username = ?', [req.query.loginUsername], function(error1, results1, fields1){
					if (error1){
						res.send(JSON.stringify({"status": 500, "error": error1, "response": null}));
						return;
					}
					res.send(JSON.stringify({"status": 200, "error": null, "response": results1}));
				});
			}
		}
		else{
			res.send(JSON.stringify({"status": 401, "error": "Bad login credentials", "response": null}));
		}
		
	});
});

//Get Inspector given EmployeeID
router.get("/api/inspectors/:id",function(req,res){
	authAndRun(res, req, 'SELECT * FROM Employees WHERE EmployeeID = ?', [req.params.id]);
});

// Update inspector given an id, an attribute, and a value
router.put("/api/inspectors/:id",function(req,res){
	// Very dangerous code for update, but could not think of a better solution.
	authAndRun(res, req, 'UPDATE Employees SET ' + req.body.attribute + ' = ? WHERE EmployeeID = ?', [req.body.value, req.params.id]);
});

// Create a new inspector given FullName, Salary, isAdmin, Username, Password
router.post("/api/inspectors",function(req,res){
	global.connection.query('SELECT isAdmin, EmployeeID, Password FROM Employees WHERE Username = ?', [req.query.loginUsername] ,function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length == 1 && bcrypt.compareSync(req.query.loginPassword, results[0]['Password'])){
			if(results[0]['isAdmin']){
				// OK if is an admin
				global.connection.query('INSERT INTO Employees (FullName, Salary, DateOfHire, isAdmin, Username, Password) VALUES (?, ?, CURDATE(), ?, ?, ?)', [req.body.fullname, req.body.salary, req.body.isAdmin, req.body.username, bcrypt.hashSync(req.body.password, 10)] ,function (error1, results1, fields1) {
					if (error1){
						res.send(JSON.stringify({"status": 500, "error": error1, "response": null}));
						return;
					}
					res.send(JSON.stringify({"status": 201, "error": null, "response": results1}));
				});
			}
			else{
				// Not OK if not an admin
				res.send(JSON.stringify({"status": 403, "error": "User is forbidden from creating new entries", "response": null}));
			}
		}
		else{
			res.send(JSON.stringify({"status": 401, "error": "Bad login credentials", "response": null}));
		}
	});
});

// Delete inspector given EmployeeID
router.delete("/api/inspectors/:id",function(req,res){
	authAndRun(res, req, 'DELETE FROM Employees WHERE EmployeeID = ?', [req.params.id]);
});

// Generalized code for call to inspector/# endpoint
function authAndRun(res, req, sqlCommand, inputValues){
	global.connection.query('SELECT isAdmin, EmployeeID, Password FROM Employees WHERE Username = ?', [req.query.loginUsername] ,function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length == 1 && bcrypt.compareSync(req.query.loginPassword, results[0]['Password'])){
			if(results[0]['isAdmin'] || req.params.id == results[0]['EmployeeID']){
				// Make sure user is either admin or getting their own data
				global.connection.query(sqlCommand, inputValues ,function (error1, results1, fields1) {
					if (error1){
						res.send(JSON.stringify({"status": 500, "error": error1, "response": null}));
						return;
					}
					res.send(JSON.stringify({"status": 200, "error": null, "response": results1}));
				});
			}
			else{
				res.send(JSON.stringify({"status": 403, "error": "User is forbidden from accessing requested data", "response": null}));
			}
		}
		else{
			res.send(JSON.stringify({"status": 401, "error": "Bad login credentials", "response": null}));
		}
	});
}


// start server running on port 3000 (or whatever is set in env)
app.use(express.static(__dirname + '/'));
app.use("/",router);
app.set( 'port', ( process.env.PORT || config.port || 3000 ));

app.listen(app.get( 'port' ), function() {
	console.log( 'Node server is running on port ' + app.get( 'port' ));
	console.log( 'Environment is ' + env);
});