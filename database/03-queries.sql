
USE EventFlowDB;
GO

/*
Verksamhetsfråga: Vilka evenemang tillhör vilken kategori för att kunna visa dem? 
En resultatrad representerar: Ett evenemang tillsammans med tillhörande kategori. 
Förväntat resultat: En lista med samtliga evenemang och dess katergori. 
Så verifierades resultatet: Kördes i SQL med testdatan och för att säkerhetsställa att rätt kategori hamnade på rätt evenemang. 
*/

SELECT e.Title, c.CategoryName
FROM EventFlow AS e
INNER JOIN Category AS c
ON e.CategoryId = c.CategoryId;

/*
Verksamhetsfråga: Vilka besökare har anmält sig till rätt evenemang?
En resultatrad representerar: Ett Evenemang har kopplat till en besökare som har anmält sig. 
Förväntat resultat: En besökare kan vara på rätt evenemang. 
Så verifierades resultatet: Kördes i SQL med testdatan för att säkerhetsställa att en besökare kan anmäla sig till ett evenemang. 
*/

SELECT e.Title, 
r.RegisteredAt,
v.VisitorName
FROM EventFlow AS e
INNER JOIN Registration AS r
ON r.EventId = e.EventId
INNER JOIN Visitor AS v
ON v.VisitorId = r.VisitorId;

/*
Verksamhetsfråga: Hur många anmälningar har varje evenemang? 
En resultatrad representerar: Ett evenemang och dess totala antal anmälningar 
Förväntat resultat: Sorterad lista över evenemang och antal registrerade 
Så verifierades resultatet: Kördes i SQL genom att räkna raderna i registration-tabellen per EventId
*/

SELECT e.EventId,
e.Title, 
COUNT (r.RegistrationId) AS TotalRegistration
FROM EventFlow AS e
INNER JOIN Registration AS r
ON r.EventId = e.EventId
GROUP BY e.EventId, e.Title;

/*
Verksamhetsfråga: Filtera och visar evenemanget kategori Teknik. 
En resultatrad representerar: Ett filtrerad lista över evenemang inom vald kategori teknik. 
Förväntat resultat: Visar endast evenemang som matcher kategorifiltreringen. 
Så verifierades resultatet: Kördes i SQL med ett specifikt categoryId och att det stämmer med testdatan. 
*/

SELECT 
e.Title,
e.EventDate,
c.CategoryName
FROM EventFlow AS e
INNER JOIN Category AS c
ON c.CategoryId = e.CategoryId
WHERE e.CategoryId = 1
ORDER BY e.EventDate ASC;
