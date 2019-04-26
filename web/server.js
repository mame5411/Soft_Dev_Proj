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

function truncate_string_to_length(str, len) {
	if(str.length > len) return str.substr(0, len);
	else return str;
}

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

function date_object_to_proper_html_string_because_everything_sucks(date) {
	let day = date.getDay();
	let month = date.getMonth();
	let year = 1900 + date.getYear();
	
	if(day < 10) day = '0' + day;
	if(month < 10) month = '0' + month;
	
	return '' + year + '-' + month + '-' + day;
}

// NOTE(rjf): Profile page
app.get('/profile',
	function(req, res) {
		var token = req.cookies.user_token;
		var username = token_table[token];
		
		var data = [
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
		
		if(username == undefined) {
			res.cookie('user_token', 'invalid-token');
			res.render('pages/profile', { page_title: "Profile", user_token:token, data:data });
		}
		else {
			db.any("select * from users where username = '" + username + "';").then(function (rows) {
				
				data[0].first_name = rows[0].first_name;
				data[0].middle_init = rows[0].middle_init;
				data[0].last_name = rows[0].last_name;
				data[0].phone = rows[0].phone;
				data[0].email = rows[0].email;
				data[0].addr = rows[0].addr;
				data[0].ste = rows[0].ste;
				data[0].city = rows[0].city;
				data[0].zip = rows[0].zip;
				
				for(let i = 0; i < 3; ++i) {
					if(rows[0].edschool && rows[0].edschool.length > i) {
						data[0].edschool[i] = rows[0].edschool[i];
					}
					if(rows[0].edgpa && rows[0].edgpa.length > i) {
						data[0].edgpa[i] = rows[0].edgpa[i];
					}
					if(rows[0].edgrad && rows[0].edgrad.length > i) {
						let date = new Date(rows[0].edgrad[i]);
						data[0].edgrad[i] = date_object_to_proper_html_string_because_everything_sucks(date);
					}
					if(rows[0].edprog && rows[0].edprog.length > i) {
						data[0].edprog[i] = rows[0].edprog[i];
					}
				}
				
				for(let i = 0; i < 3; ++i) {
					if(rows[0].jobtitle && rows[0].jobtitle.length > i) {
						data[0].jobtitle[i] = rows[0].jobtitle[i];
					}
					if(rows[0].jobstart && rows[0].jobstart.length > i) {
						let date = new Date(rows[0].jobstart[i]);
						data[0].jobstart[i] = date_object_to_proper_html_string_because_everything_sucks(date);
					}
					if(rows[0].jobend && rows[0].jobend.length > i) {
						let date = new Date(rows[0].jobend[i]);
						data[0].jobend[i] = date_object_to_proper_html_string_because_everything_sucks(date);
					}
					if(rows[0].jobdesc && rows[0].jobdesc.length > i) {
						data[0].jobdesc[i] = rows[0].jobdesc[i];
					}
					if(rows[0].jobcomp && rows[0].jobcomp.length > i) {
						data[0].jobcomp[i] = rows[0].jobcomp[i];
					}
				}
				
				res.render('pages/profile', { page_title: "Profile", user_token:token, data:data });
			})
			.catch(function (err) {
				// request.flash('error', err);
			});
		}
	});
	
// NOTE(rjf): Profile page update
app.post('/profile',
	function(req, res) {
		var token = req.cookies.user_token;
		var username = token_table[token];
		
		var data = [
			{
				first_name: req.body.first_name,
				middle_init: req.body.middle_init,
				last_name: req.body.last_name,
				phone: req.body.phone,
				email: req.body.email,
				addr: req.body.addr,
				ste: req.body.ste,
				city: req.body.city,
				zip: req.body.zip,
				edschool: [req.body.edschool[0], req.body.edschool[1], req.body.edschool[2]],
				edgpa: [req.body.edgpa[0], req.body.edgpa[1], req.body.edgpa[2]],
				edgrad: ['', '', ''],
				edprog: [req.body.edprog[0], req.body.edprog[1], req.body.edprog[2]],
				edhighlights: [],
				jobtitle: ['', '', '', '', ''],
				jobstart: ['', '', '', '', ''],
				jobend: ['', '', '', '', ''],
				jobdesc: ['', '', '', '', ''],
				jobcomp: ['', '', '', '', ''],
			}
		];
		
		data[0].first_name = truncate_string_to_length(data[0].first_name, 20);
		data[0].last_name = truncate_string_to_length(data[0].last_name, 20);
		data[0].middle_init = truncate_string_to_length(data[0].middle_init, 1);
		data[0].phone = truncate_string_to_length(data[0].phone, 14);
		data[0].email = truncate_string_to_length(data[0].email, 100);
		data[0].addr = truncate_string_to_length(data[0].addr, 100);
		data[0].city = truncate_string_to_length(data[0].city, 50);
		data[0].ste = truncate_string_to_length(data[0].ste, 50);
		data[0].zip = truncate_string_to_length(data[0].zip, 12);
		
		if(username == undefined) {
			// TODO(rjf): Handle the case where the user enters data but does not have an account
		}
		else {
			let query = "UPDATE users SET " +
			"first_name='" + data[0].first_name + "', " +
			"last_name='" + data[0].last_name + "', " +
			"middle_init='" + data[0].middle_init + "', " +
			"phone='" + data[0].phone + "', " +
			"email='" + data[0].email + "', " +
			"addr='" + data[0].addr + "', " +
			"city='" + data[0].city + "', " +
			"ste='" + data[0].ste + "', " +
			"zip='" + data[0].zip + "', " +
			"edschool[0]='" + data[0].edschool[0] + "', " +
			"edgpa[0]='" + data[0].edgpa[0] + "', " +
			// "edgrad[0]='" + data[0].edgrad[0] + "', " +
			"edprog[0]='" + data[0].edprog[0] + "' " +
			/*
			"jobtitle='" + data[0].jobtitle[0] + "';'" + data[0].jobtitle[1] + "';'" + data[0].jobtitle[2] + "', " +
			"jobstart='" + data[0].jobstart[0] + "';'" + data[0].jobstart[1] + "';'" + data[0].jobstart[2] + "', " +
			"jobend='" + data[0].jobend[0] + "';'" + data[0].jobend[1] + "';'" + data[0].jobend[2] + "', " +
			"jobdesc='" + data[0].jobdesc[0] + "';'" + data[0].jobdesc[1] + "';'" + data[0].jobdesc[2] + "', " +
			"jobcomp='" + data[0].jobcomp[0] + "';'" + data[0].jobcomp[1] + "';'" + data[0].jobcomp[2] + "' " +
			*/
			"WHERE username = '" + username + "';";
			
			console.log(query);
			
			db.any(query).then(function (rows) {
				res.redirect('/profile');
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
		var str2 = '\\name{' + rows[0].first_name + ' ' + rows[0].last_name +'}\n'+
				   '\\address{'+rows[0].addr+', ' + rows[0].city + ', ' + rows[0].ste +
				   		', ' + rows[0].zip + '}\n'+
				   '\\address{'+rows[0].phone+' \\\\ '+rows[0].email+'}\n';
		
		fs.appendFileSync(path, str2, function (err) {
			if (err)
				return console.log(err);
			console.log(str2);
		});

		// begin the document
		fs.appendFileSync(path, '\\begin{document}\n', function (err) {
			if (err) 
				return console.log(err);
			console.log('document begun');
		});

		str3 = '\\begin{rSection}{Education}\n'+
			   '{\\bf '+ rows[0].edschool[0] + '} \\hfill {\\em Graduated: '+date_object_to_proper_html_string_because_everything_sucks(rows[0].edgrad[0])+'}\n'+
			   '\\\\ '+rows[0].edprog[0]+'\\hfill {GPA: '+rows[0].edgpa[0]+' }\n'+
			   '\\\\{\\bf '+ rows[0].edschool[1] + '} \\hfill {\\em Graduated: '+date_object_to_proper_html_string_because_everything_sucks(rows[0].edgrad[1])+'}\n'+
			   '\\\\ '+rows[0].edprog[1]+'\\hfill {GPA: '+rows[0].edgpa[1]+' }\n'+
			   // '\\\\{\\bf '+ rows[0].edschool[2] + '} \\hfill {\\em Graduated: '+date_object_to_proper_html_string_because_everything_sucks(rows[0].edgrad[2])+'}\n'+
			   // '\\\\ '+rows[0].edprog[2]+'\\hfill {GPA: '+rows[0].edgpa[2]+' }\n'+
			   '\\end{rSection}\n';
		
		fs.appendFileSync(path, str3, function (err) {
			if (err)
				return console.log(err);
			console.log(str3);
		});

		str4 = '\\begin{rSection}{Work Experience}\n'+
			   '{\\bf '+ rows[0].jobcomp[0] + '}\n '+
			   '\\\\ '+rows[0].jobtitle[0]+'\\hfill {\\em Employed: '+date_object_to_proper_html_string_because_everything_sucks(rows[0].jobstart[0])+' - '+date_object_to_proper_html_string_because_everything_sucks(rows[0].jobend[0])+'}\n'+
			   '\\begin{quote}\n'+
			   rows[0].jobdesc[0]+'\n'+
			   '\\end{quote}\n'+
			   '\\\\{\\bf '+ rows[0].jobcomp[1] + '}\n '+
			   '\\\\ '+rows[0].jobtitle[1]+'\\hfill {\\em Employed: '+date_object_to_proper_html_string_because_everything_sucks(rows[0].jobstart[1])+' - '+date_object_to_proper_html_string_because_everything_sucks(rows[0].jobend[1])+'}\n'+
			   '\\begin{quote}\n'+
			   rows[0].jobdesc[1]+'\n'+
			   '\\end{quote}\n'+
			   // '\\\\{\\bf '+ rows[0].edschool[2] + '} \\hfill {\\em Graduated: '+date_object_to_proper_html_string_because_everything_sucks(rows[0].edgrad[2])+'}\n'+
			   // '\\\\ '+rows[0].edprog[2]+'\\hfill {GPA: '+rows[0].edgpa[2]+' }\n'+
			   '\\end{rSection}\n';
	
		fs.appendFileSync(path, str4, function (err) {
			if (err)
				return console.log(err);
			console.log(str4);
		});		
		// end the document
		fs.appendFileSync(path, '\\end{document}', function (err) {
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
