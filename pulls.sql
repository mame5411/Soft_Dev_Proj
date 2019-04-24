-- this_user is the Variable for current user.
SELECT * FROM users WHERE username = this_user;
-- Pulling users full name.
SELECT first_name, last_name, middle_init FROM users WHERE username = this_user;
-- Pulling user contact info.
SELECT phone, email FROM users WHERE username = this_user;
-- Pulling list of user names to check if name was already used.
SELECT username FROM users;
-- Pulling user location information.
SELECT addr, city, ste,zip FROM users WHERE username = this_user;
-- Pulling user School info
SELECT EDschool,EDgpa FROM users WHERE username = this_user;
-- Pulling more user school info
SELECT EDgrad, EDprog, EDhighlights FROM users WHERE username = this_user;
-- Pulling job information for user.
SELECT JOBtitle, JOBstart, JOBend, JOBdesc, JOBcomp FROM users WHERE username = this_user;
-- Checking to see if user logs in correctly.
SELECT username FROM users WHERE (username = user_input AND pass = pass_input);
-- pulling password of user.
SELECT pass FROM users WHERE username = this_user;
-- pulling first name of user.
SELECT first_name FROM users WHERE username = this_user;
-- pulling last name of user.
SELECT last_name FROM users WHERE username = this_user;
-- pulling middle innitial of user.
SELECT middle_init FROM users WHERE username = this_user; 
-- pulling phone number of user.
SELECT phone FROM users WHERE username = this_user;
-- pulling email of user.
SELECT email FROM users WHERE username = this_user;
-- pulling address of user.
SELECT addr FROM users WHERE username = this_user;
-- pulling city of user.
SELECT city FROM users WHERE username = this_user;
-- pulling state of user.
SELECT ste FROM users WHERE username = this_user;
-- pulling zip code of user.
SELECT zip FROM users WHERE username = this_user;
-- pulling list of schools of user.
SELECT EDschool FROM users WHERE username = this_user;
-- pulling list of GPS's for user.
SELECT EDgpa FROM users WHERE username = this_user;
-- pulling list of graduation dates for user;
SELECT EDgrad FROM users WHERE username = this_user;
-- pulling list of Majors for user.
SELECT EDprog FROM users WHERE username = this_user;
-- pulling list of classes user wants to list.
SELECT EDhighlights FROM users WHERE username = this_user;
-- pulling list of job titles for user.
SELECT JOBtitle FROM users WHERE username = this_user;
-- pulling list of start dates for jobs for user.
SELECT JOBstart FROM users WHERE username = this_user;
-- pulling list of end dates for user.
SELECT JOBend FROM users WHERE username = this_user;
-- pulling list of job descriptions for user.
SELECT JOBdesc FROM users WHERE username = this_user;
-- pullung list of companies that the user worked for.
SELECT JOBcomp FROM users WHERE username = this_user;