
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
'Hugh',
'Dicks',
'G',
'This is a test short bio.',
'303-867-5309',
'pussycrusher@aol.com',
'65th & Inglside',
'Chiraq',
'Billinois',
'69696',
'{"DeVry U","CU"}',
'{4.0,0.0}',
'{"3005-04-20","1776-07-04"}',
'{"Underwater Basket Weaving","Toilet Enterprise"}',
'{"toilet licking","condom weaving","graveyard networking","STD Contractions"}',
'{"Pleasure Specialist","Crack Daddy"}',
'{"2000-01-11","1969-12-25"}',
'{NOW(),"2000-01-10"}',
'{"Rub then Tug","Dispenser of superpowers"}',
'{"Massages+","Legit Drugs"}'
);

INSERT INTO users VALUES (
'user2',
'pass2',
'Ben',
'Over',
'D',
'This is another test short bio.',
'420-Bla-zeit',
'dickmasher@aol.com',
'Hard Way ave',
'Pound Town',
'Colorado',
'99999',
'{"CSU","Ariz. St."}',
'{4.0,4.0}',
'{"2005-02-21","1200-09-09"}',
'{"Farming Methods","Not College"}',
'{"glue eating","Dirct Milk Extraction","Crabs","STD Contractions"}',
'{"Make-A-Wish Kid","A literal chair"}',
'{"1960-12-21","2010-01-14"}',
'{NOW(),"2001-07-09"}',
'{"Has Disability","People sit on me"}',
'{"Make-A-Wish","Chairs and People"}'
);
