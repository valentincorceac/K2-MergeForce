UPPGIFT 1 – JOIN

Fråga: Vilka besökare har anmält sig till vilka evenemang? 

En resultatrad representerar:
En anmälan med besökarens namn och evenemangets titel.

Tabeller: Registration, Visitor och Event.

Kopplingar:
Registration.FkVisitorId (FK) = Visitor.VisitorId (PK).
Registration.FkEventId (FK) = Event.EventId (PK).

SELECT
    r.RegistrationId,
    v.FullName AS VisitorName,
    e.Title AS EventTitle,
    e.Date AS EventDate,
    e.StartAt,
    r.RegisteredAt
FROM Registration AS r
INNER JOIN Visitor AS v
    ON v.VisitorId = r.FkVisitorId
INNER JOIN Event AS e
    ON e.EventId = r.FkEventId

ORDER BY e.Date, e.StartAt, v.FullName;



UPPGIFT 2 – AGGREGAT

Fråga: Hur många anmälningar har varje evenemang?

En resultatrad representerar:
Ett evenemang med antalet anmälningar, även om antalet är noll.

Tabeller: Event och Registration.

Koppling:
Event.EventId (PK) = Registration.FkEventId (FK).

SELECT
    e.EventId,
    e.Title AS EventTitle,
    COUNT(r.RegistrationId) AS RegistrationCount
FROM Event AS e
LEFT JOIN Registration AS r
    ON r.FkEventId = e.EventId
GROUP BY
    e.EventId,
    e.Title
ORDER BY RegistrationCount DESC;

3. Verifiera frågorna
  
För varje fråga:
Förutsäg ungefär hur många rader eller grupper som ska visas. - ca 10
Kontrollera underlaget med en enklare SELECT. - FROM Event
Kontrollera manuellt minst en rad eller grupp.- WHERE EventId = Fk.EventId  
Skriv en kort kommentar ovanför frågan. - På bokningar finns träningspass, där en resultatrad visar ett träningspass och Pass 1 räknas som 2 bokningar. 


