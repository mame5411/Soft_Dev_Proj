/***********************
  Load Components!
  
  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
//var bcrypt = require('bcrypt');
var express_session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var token_table = {};

//Create Database Connection
// var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/

// const dbConfig = process.env.DATABASE_URL;

// var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed
   
 Web Page Requests:
 
  Login Page:        Provided For your (can ignore this page)
  Registration Page: Provided For your (can ignore this page)
  Home Page:
    /home - get request (no parameters) 
      This route will make a single query to the favorite_colors table to retrieve all of the rows of colors
      This data will be passed to the home view (pages/home)
      
    /home/pick_color - post request (color_message)
      This route will be used for reading in a post request from the user which provides the color message for the default color.
      We'll be "hard-coding" this to only work with the Default Color Button, which will pass in a color of #FFFFFF (white).
      The parameter, color_message, will tell us what message to display for our default color selection.
      This route will then render the home page's view (pages/home)
      
    /home/pick_color - get request (color)
      This route will read in a get request which provides the color (in hex) that the user has selected from the home page.
      Next, it will need to handle multiple postgres queries which will:
       1. Retrieve all of the color options from the favorite_colors table (same as /home)
       2. Retrieve the specific color message for the chosen color
      The results for these combined queries will then be passed to the home view (pages/home)
      
    /team_stats - get request (no parameters)
     This route will require no parameters.  It will require 3 postgres queries which will:
      1. Retrieve all of the football games in the Fall 2018 Season
      2. Count the number of winning games in the Fall 2018 Season
      3. Count the number of lossing games in the Fall 2018 Season
     The three query results will then be passed on to the team_stats view (pages/team_stats).
     The team_stats view will display all fo the football games for the season, show who won each game, 
     and show the total number of wins/losses for the season.
     
    /player_info - get request (no parameters)
     This route will handle a single query to the football_players table which will retrieve the id & name for all of the football players.
     Next it will pass this result to the player_info view (pages/player_info), which will use the ids & names to populate the select tag for a form 
************************************/

var token = function() {

    return Math.random().toString(36).substr(2); // remove `0.`

};

// NOTE(rjf): Home page
app.get('/',
        function(req, res) {
            res.render('pages/home',
                       {
                           page_title: "Resume Builder",
                       });
        });

// NOTE(rjf): Login page
app.get('/login',
        function(req, res) {
            res.render('pages/login',
                       {
                           page_title: "Login",
                       });
        });

// NOTE(rjf): Profile page
app.get('/profile',
        function(req, res) {
            res.render('pages/profile',
                       {
                           page_title: "Profile",
                       });
        });
		
// NOTE(rjf): Generate page
app.get('/generate',
        function(req, res) {
            res.render('pages/generate',
                       {
                           page_title: "Generate",
                       });
        });

// NOTE(jlb): Results page
app.get('/results',
        function(req, res) {
          var preamble =  '\\documentclass{resume}\n'+
                          '\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}\n'+
                          '\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}}';
          var str2 = 'test';
          var path = 'Latex_templates/helloworld.txt';
            res.render('pages/results',
                       {
                           page_title: "Results",
                       });
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
              if (err) 
                return console.log(err);
              console.log('Wrote Hello World in file helloworld.txt, just check it');
            });
            fs.appendFileSync(path, str2, function (err) {
              if (err)
                return console.log(err);
              console.log('The "data to append" was appended to file!');
            });
        });



// NOTE(rjf): Log in request
app.post('/login',
        function(req, res) {
			console.log(req.body);
			
			var username = 'george';
			var user_token = token();
			
			token_table[user_token] = username;
			
			res.writeHead(301, {Location: '/profile'});
			// res.send(user_token);
			res.end();
		});

// NOTE(rjf): Log out
app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

/*
// home page 
app.get('/home', function(req, res) {
        var query = 'select * from favorite_colors;';
        db.any(query)
        .then(function (rows) {
              // render views/store/list.ejs template file
              res.render('pages/home',{
                         my_title: "Home Page",
                         data: rows,
                         color: '',
                         color_msg: ''
                         })
              
              })
        .catch(function (err) {
               // display error message in case an error
               request.flash('error', err);
               response.render('pages/home', {
                               title: 'Home Page',
                               data: '',
                               color: '',
                               color_msg: ''
                               })
               })
        
        });
*/

let port = 3000;
app.listen(port);
console.log("PORT: " + port);
