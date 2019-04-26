// NOTE(rjf): Load components
var express = require('express'); //Ensure our express framework has been added
var express_session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var pgp = require('pg-promise')();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var token_table = {};

// NOTE(rjf): Database connection
// const dbConfig = process.env.DATABASE_URL;
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'users',
	user: 'postgres',
	password: 'dunlore1',
};

var db = pgp(dbConfig);

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
		var username = token_table[token];
		res.render('pages/home', { page_title: "Resume Builder", user_token:token, });
	});

// NOTE(rjf): Login page
app.get('/login',
	function(req, res) {
		var token = req.cookies.user_token;
		var username = token_table[token];
		if(token == 'invalid-token' || username == undefined) {
			token = 'invalid-token';
			res.cookie('user_token', 'invalid-token');
			res.render('pages/login', { page_title: "Login", user_token:token, });
		}
		else {
			res.redirect('/profile');
		}
	});

// NOTE(rjf): Sign up page
app.get('/signup',
	function(req, res) {
		var token = req.cookies.user_token;
		var username = token_table[token];
		if(token == 'invalid-token' || username == 'undefined') {
			res.render('pages/signup', { page_title: "Sign Up", user_token:token, });
		}
		else {
			res.redirect('/profile');
		}
	});

// NOTE(rjf): Profile page
app.get('/profile',
	function(req, res) {
		var token = req.cookies.user_token;
		var username = token_table[token];
		
		if(username == undefined) {
			var placeholder_data = [
			{
				first_name: '',
				middle_init: '',
				last_name: '',
				phone: '',
				email: '',
				addr: '',
				ste: '',
				city: '',
				zip: '',
				edschool: ['', '', ''],
				edgpa: ['', '', ''],
				edgrad: ['', '', ''],
				edprog: ['', '', ''],
				edhighlights: [],
				jobtitle: ['', '', '', '', ''],
				jobstart: ['', '', '', '', ''],
				jobend: ['', '', '', '', ''],
				jobdesc: ['', '', '', '', ''],
				jobcomp: ['', '', '', '', ''],
			}
			];
			
			res.cookie('user_token', 'invalid-token');
			res.render('pages/profile', { page_title: "Profile", user_token:token, data:placeholder_data });
		}
		else {
			db.any("select * from users where username = '" + username + "';").then(function (rows) {
				console.log(rows);
				res.render('pages/profile', { page_title: "Profile", user_token:token, data:rows });
			})
			.catch(function (err) {
				// request.flash('error', err);
			});
		}
	});
	
// NOTE(rjf): Generate page
app.get('/generate',
	function(req, res) {
		var token = req.cookies.user_token;
		var username = token_table[token];
		
		if(username == undefined) {
			res.cookie('user_token', 'invalid-token');
		}
		
		if(token != 'invalid-token' && username != undefined) {
			res.render('pages/generate', { page_title: "Generate", user_token:token, });
		}
		else {
			res.redirect('/login');
		}
	});

function generate_resume(user_token, template_num, username) {
	var preamble =  '\\documentclass{resume}\n'+
					'\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}\n'+
					'\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}}\n'+
					'\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}\n';
	var path = 'generated/resume' + user_token + '.txt';
	
	fs = require('fs');
	try {
		if (fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
	} catch(err) {
		console.error(err);
	}
	
	fs.appendFileSync(path, preamble, function (err) {
		if (err) {
			return console.log(err);
		}
	});
	
	db.any("select * from users where username = '" + username + "'").then(function (rows) {
		var str2 = '\\name{' + rows[0].username + '}\n';
		
		fs.appendFile(path, str2, function (err) {
			if (err)
				return console.log(err);
			console.log(str2);
		});

		// begin the document
		fs.appendFile(path, '\\begin{document}\n', function (err) {
			if (err) 
				return console.log(err);
			console.log('document begun');
		});

		// end the document
		fs.appendFile(path, '\\end{document}', function (err) {
			if (err)
				return console.log(err);
			console.log('Document ended!');
		});

    })
    .catch(function (err) {
        //request.flash('error', err);
    });
	
}

// NOTE(rjf): Generate request
app.post('/generate',
	function(req, res) {
		var token = req.cookies.user_token;
		var template_num = req.body.template_num;
		var username = token_table[token];
		
		if(username == undefined) {
			res.cookie('user_token', 'invalid-token');
			res.redirect('/login');
		}
		else {
			generate_resume(token, template_num, username);
			res.redirect('/results');
		}
		
	});

// NOTE(jlb): Results page
app.get('/results',
	function(req, res) {
		var token = req.cookies.user_token;
		var username = token_table[token];
		
		if(username == undefined) {
			res.cookie('user_token', 'invalid-token');
			res.redirect('/login');
		}
		else {
			res.render('pages/results', { page_title: "Profile", user_token:token, });
		}
	});


// NOTE(rjf): Log in request
app.post('/login',
	function(req, res) {
		var user = req.body.user;
		var pass = req.body.pass;
		var user_token = token();
		
		let query = 'SELECT username, pass FROM users WHERE username = \'' + user + '\';';
		db.any(query).then(function(rows) {
			if(rows[0].pass == pass) {
				token_table[user_token] = user;
				res.cookie('user_token', user_token);
				res.redirect('/profile');
			}
			else {
				res.redirect('/login');
			}
		}).catch(function(err) {
			res.redirect('/login');
		});
	});

// NOTE(rjf): Sign up request
app.post('/signup',
	function(req, res) {
		var user = req.body.user;
		var pass = req.body.pass;
		var user_token = token();
		
		let query = "INSERT INTO users (username, pass)" +
                    "SELECT '" + user + "','" + pass + "'" +
                    "WHERE NOT EXISTS(SELECT username FROM users WHERE username='" + user + "');";
		
		db.any(query).then(function(rows) {
			let query2 = 'SELECT username FROM users WHERE (username=\'' + user + '\' AND first_name IS NULL);';
			
			db.any(query).then(function(rows) {
				res.redirect('/login');
			}).catch(function(err) {
				res.redirect('/signup');
			});
			
		}).catch(function(err) {
			res.redirect('/signup');
		});
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
