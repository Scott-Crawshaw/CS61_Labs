use `sql-murder-mystery`;

SELECT `description` FROM crime_scene_report WHERE `date` = 20180115 AND city = 'SQL CITY' AND `type` = 'murder';
-- Security footage shows that there were 2 witnesses. The first witness lives at the last house on Northwestern Dr. The second witness, named Annabel, lives somewhere on Franklin Ave

SELECT id FROM person WHERE `name` like 'Annabel %';
-- ID: 16371

SELECT id FROM person WHERE address_street_name = 'Northwestern Dr' AND address_number = 
(select max(address_number) from person WHERE address_street_name = 'Northwestern Dr');
-- MAX Address Number ID: 14887

SELECT id FROM person WHERE address_street_name = 'Northwestern Dr' AND address_number = 
(select min(address_number) from person WHERE address_street_name = 'Northwestern Dr');
-- MIN Address Number ID: 89906

SELECT transcript FROM interview WHERE person_id = 16371;
-- Annabel: I saw the murder happen, and I recognized the killer from my gym when I was working out last week on January the 9th.

SELECT transcript FROM interview WHERE person_id = 14887;
-- MAX Address Witness: I heard a gunshot and then saw a man run out. He had a Get Fit Now Gym bag. The membership number on the bag started with 48Z. Only gold members have those bags. The man got into a car with a plate that included H42W.

SELECT transcript FROM interview WHERE person_id = 89906;
-- No result from MIN Address.

SELECT * FROM get_fit_now_member WHERE id LIKE '48Z%' and membership_status = 'gold';
-- Either Jeremy Bowers (48Z55) or Joe Germuska (48Z7A)

SELECT * FROM get_fit_now_check_in WHERE check_in_date = '20180109' AND membership_id = '48Z55' OR membership_id = '48Z7A';
-- Both of them were there.

SELECT * FROM person WHERE `name` = 'Jeremy Bowers' or `name` = 'Joe Germuska';
-- Jeremy Bowers license id is 423327, and Joe Germuska license id is 173289

SELECT * FROM drivers_license WHERE plate_number like '%H42W%' AND id = '423327' OR id = '173289';
-- Jeremy Bowers owns the car that the witness saw the killer run into.
-- Therefore, Jeremy Bowers is the killer.

SELECT transcript FROM interview WHERE person_id = (select id from person WHERE `name` = 'Jeremy Bowers');
-- I was hired by a woman with a lot of money. I don't know her name but I know she's around 5'5" (65") or 5'7" (67"). She has red hair and she drives a Tesla Model S. I know that she attended the SQL Symphony Concert 3 times in December 2017.

SELECT person_ID, count(*) as NumberOfCheckIns FROM facebook_event_checkin WHERE event_name = 'SQL Symphony Concert'
AND `date` like '201712%' GROUP BY person_ID HAVING NumberOfCheckIns = 3;
-- Could be person 24556 or person 99716;

SELECT * FROM person WHERE id = 24556 OR id = 99716;
-- Could be Miranda Priestly (License 202298) or Bryan Pardo (License 101191), probably Miranda because woman

SELECT * FROM drivers_license WHERE id = 202298 or id = 101191;
-- No entry for Bryan. Miranda has red hair, is a female, drives a tesla model s, and is 68" tall. Almost definitely her, but let's check income.

SELECT annual_income FROM income WHERE ssn = (select ssn from person where license_id = 202298);
-- She makes $310,000 per year, so she's rich
-- Verdict: Miranda Priestly paid Jeremy Bowers to commit the murder.






