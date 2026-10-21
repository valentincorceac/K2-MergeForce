USE EventFlowDB;
GO

INSERT INTO Category (CategoryName) 
  VALUES ('Teknik');   
INSERT INTO Category (CategoryName) 
  VALUES ('Musik');    
INSERT INTO Category (CategoryName) 
  VALUES ('Kultur');   

INSERT INTO Venue (VenueName, VenueAddress) 
  VALUES ('Studenthuset', 'Exempelvagen 1, Umea');   
INSERT INTO Venue (VenueName, VenueAddress) 
  VALUES ('Kulturhuset', 'Exempelgatan 5, Umea');    

INSERT INTO Organizer (OrganizerName, Email) 
  VALUES ('Umea Studentforening', 'kontakt@exempel.se');  
INSERT INTO Organizer (OrganizerName, Email) 
  VALUES ('Umea Musikklubb', 'musik@exempel.se');         

INSERT INTO Visitor (VisitorName, Email, Phonenummer) 
  VALUES ('Robin Berg', 'robin@exempel.se', '0700000001');  
INSERT INTO Visitor (VisitorName, Email, Phonenummer) 
  VALUES ('Dana Ek', 'dana@exempel.se', '0700000002');      

INSERT INTO EventFlow (Title, EventDate, StartAt, EventDescription, CategoryId, VenueId, OrganizerId)
VALUES ('Coding Night', '2026-10-20', '2026-10-20 18:00', 'Ova programmering tillsammans', 1, 1, 1);  

INSERT INTO EventFlow (Title, EventDate, StartAt, EventDescription, CategoryId, VenueId, OrganizerId)
VALUES ('Musikkvall', '2026-10-22', '2026-10-22 19:00', 'Lyssna pa livemusik', 2, 1, 1);             

INSERT INTO EventFlow (Title, EventDate, StartAt, EventDescription, CategoryId, VenueId, OrganizerId)
VALUES ('Kulturkvall', '2026-10-25', '2026-10-25 17:00', 'Konst och samtal', 3, 2, 2);               

INSERT INTO Registration (RegisteredAt, VisitorId, EventId) 
  VALUES ('2026-10-12 11:00', 1, 1);  
INSERT INTO Registration (RegisteredAt, VisitorId, EventId) 
  VALUES ('2026-10-12 11:05', 2, 2);  
INSERT INTO Registration (RegisteredAt, VisitorId, EventId) 
  VALUES ('2026-10-12 11:10', 1, 2);  


-- Kontrollera resultatet.

SELECT * FROM Category;
SELECT * FROM Venue;
SELECT * FROM Organizer;
SELECT * FROM Visitor;
SELECT * FROM EventFlow;
SELECT * FROM Registration;
