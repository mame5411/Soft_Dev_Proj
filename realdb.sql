
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;



SET default_tablespace = '';

SET default_with_oids = false;


---
--- drop tables
---

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	username character varying(20) NOT NULL PRIMARY KEY,
	pass character varying(20) NOT NULL,
	first_name character varying(20),
	last_name character varying(20),
	middle_init character varying(1),
	short_bio character varying(250),
	phone character varying(14),
	email character varying(100),
	addr character varying(100),
	city character varying(50),
	ste character varying(50),
	zip character varying(12),
	EDschool text ARRAY[3],
	EDgpa float ARRAY[3],
	EDgrad date ARRAY[3],
	EDprog text ARRAY[3],
	EDhighlights text ARRAY[3],
	JOBtitle text ARRAY[5],
	JOBstart date ARRAY[5],
	JOBend date ARRAY[5],
	JOBdesc text ARRAY[5],
	JOBcomp text ARRAY[5]
);

--- toss in some summy users to write queries

INSERT INTO users VALUES (
'user1',
'pass1',
'Steve',
'Wozniak',
'G',
'I spend my free time designing and building cool technology. I am responsible for the PC as we know it today.',
'916-555-5309',
'thewoz@apple.com',
'5532 Tech Drive',
'San Jose',
'California',
'45296',
'{"University of California, Berkeley","University of Colorado Boulder"}',
'{4.0,3.5}',
'{"1987-06-10","1989-07-04"}',
'{"BS in Electrical Engineering and Computer Science","Honorary Doctorate"}',
'{"I went back and finished this degree after finishing the Apple II.","Even though they kicked me out, they still awarded me an honorary doctorate for my contributions to science.","",""}',
'{"Inventor, Hardware designer","Philanthropist"}',
'{"1976-01-11","1985-12-25"}',
'{"1985-12-25",NOW()}',
'{"Designed, built, and tested the Apple I, Apple II, and many other products. I made significant advancements in the field of personal computing, but the most profound was bringing color to the computer.","I supported the kids of the Los Gatos School District for many years. Connecting students and teachers with technology is an important undertakeing."}',
'{"Apple Computer Inc.","Electronic Frontier Foundation"}'
);

INSERT INTO users VALUES (
'user2',
'pass2',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'{"",""}',
'{0.0,0.0}',
'{"2000-01-01","2000-01-01"}',
'{"",""}',
'{"","","",""}',
'{"",""}',
'{"2000-01-01","2000-01-01"}',
'{NOW(),NOW()}',
'{"",""}',
'{"",""}'
);
