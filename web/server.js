// NOTE(rjf): Load components
var express = require('express'); //Ensure our express framework has been added
var express_session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var token_table = {};

// NOTE(rjf): Database connection
// const dbConfig = process.env.DATABASE_URL;
// var db = pgp(dbConfig);

// NOTE(rjf): Set view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

var token = function() {
    return Math.random().toString(36).substr(2);
};

// NOTE(rjf): Home page
app.get('/',
	function(req, res) {
		var token = req.cookies.user_token;
		res.render('pages/home', { page_title: "Resume Builder", user_token:token, });
	});

// NOTE(rjf): Login page
app.get('/login',
	function(req, res) {
		var token = req.cookies.user_token;
		if(token == 'invalid-token') {
			res.render('pages/login', { page_title: "Login", user_token:token, });
		}
		else {
			res.redirect('/profile');
		}
	});

// NOTE(rjf): Profile page
app.get('/profile',
	function(req, res) {
		var token = req.cookies.user_token;
		res.render('pages/profile', { page_title: "Profile", user_token:token, });
	});
	
// NOTE(rjf): Generate page
app.get('/generate',
	function(req, res) {
		var token = req.cookies.user_token;
		if(token != 'invalid-token') {
			res.render('pages/generate', { page_title: "Generate", user_token:token, });
		}
		else {
			res.redirect('/login');
		}
	});

// NOTE(rjf): Generate request
app.post('/generate',
	function(req, res) {
		
	});

// NOTE(jlb): Results page
app.get('/results',
	function(req, res) {
		var preamble =  '\\documentclass{resume}\n'+
						'\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}\n'+
						'\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}}';
		var str2 = 'test';
		var path = 'Latex_templates/helloworld.txt';
	  
		var token = req.cookies.user_token;
		res.render('pages/results', { page_title: "Results", });
		fs = require('fs');

		try {
			if (fs.existsSync(path)) {
				console.log("exists")
				fs.unlinkSync(path);
			}
		} catch(err) {
			console.error(err)
		}
		
		fs.appendFileSync(path, preamble, function (err) {
			if (err) {
				return console.log(err);
			}
			console.log('Wrote Hello World in file helloworld.txt, just check it');
		});
		fs.appendFileSync(path, str2, function (err) {
			if (err) {
				return console.log(err);
			}
			console.log('The "data to append" was appended to file!');
		});
	});


// NOTE(rjf): Log in request
app.post('/login',
	function(req, res) {
		console.log(req.body);
		
		var user = req.body.user;
		var pass = req.body.pass;
		var user_token = token();
		
		token_table[user_token] = user;
		
		res.cookie('user_token', user_token);
		res.set('Content-Type', 'text/html');
		res.render('pages/profile', { page_title: "Profile", user_token:token, });
	});

// NOTE(rjf): Log out
app.get('/logout',
	function(req, res) {
		delete token_table[req.cookies.user_token];
		res.cookie('user_token', 'invalid-token');
		res.redirect('/');
	});

let port = 3000;
app.listen(port);
console.log("PORT: " + port);
