--- Registration

--Create new user with distinct username
INSERT INTO users (username, pass)
SELECT 'user4','pass4'
WHERE NOT EXISTS(SELECT username FROM users WHERE username='user4');

--Check if username was inserted
SELECT username FROM users WHERE (username='user4' AND first_name IS NULL);

--insert basic info

--first name
UPDATE users SET first_name='Mike' WHERE username='user4';

--last name
UPDATE users SET last_name='Oxlong' WHERE username='user4';

--middle init
UPDATE users SET middle_init='' WHERE username='user4';

--phone
UPDATE users SET phone='877-393-4448' WHERE username='user4';

--email
UPDATE users SET email='hotchiq4cheap@hotmail.com' WHERE username='user4';

--addr
UPDATE users SET addr='69 Dirt Road' WHERE username='user4';

--city
UPDATE users SET city='Pound Town' WHERE username='user4';

--ste
UPDATE users SET ste='Alaska' WHERE username='user4';

--zip
UPDATE users SET zip='00000' WHERE username='user4';


--EDUCATION

--edschool
UPDATE users SET edschool[1]='Brazzers U' WHERE username='user4';

--edgpa
UPDATE users SET edgpa[1]=4.0 WHERE username='user4';

--edgrad
UPDATE users SET edgrad[1]='0001-01-01' WHERE username='user4';

--edprog
UPDATE users SET edprog[1]='ANAL' WHERE username='user4';

--edhighlights
UPDATE users SET edhighlights[1]='ANAL' WHERE username='user4';

--JOBS

--jobtitle
UPDATE users SET jobtitle[1]='???' WHERE username='user4';

--jobstart
UPDATE users SET jobstart[1]='0001-01-01' WHERE username='user4';

--jobend
UPDATE users SET jobend[1]='0001-01-01' WHERE username='user4';

--jobdesc
UPDATE users SET jobdesc[1]='???' WHERE username='user4';

--jobcomp
UPDATE users SET jobcomp[1]='???' WHERE username='user4';