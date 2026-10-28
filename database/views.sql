  -- Fråga: Vilken verksamhetsfråga vyn besvarar
  -- Svar: Se alla information om Events.
  
  -- Fråga: Vad en resultatrad representerar
  -- Svar: Information om Events som sparar i tabell view.

  -- Fråga: vilka tabeller som används
  -- Svar: EventFlow, Category, Venue, Organizer.

  -- Fråga: hur vyn har testats
  -- Svar: Vi använde CREATE VIEW som vi sedan testade med våran testdata. Genom SELECT * FROM dbo.vw_EventOverview.


USE EventFlowDB
GO

ALTER VIEW dbo.vw_EventOverview
AS
SELECT
    e.EventId,
    e.Title,
    e.StartAt,
    e.EventDate,
    e.EventDescription,
    c.CategoryName,
    v.VenueName,
    v.VenueAddress,
    o.OrganizerName,
    o.Email AS organizerEmail
FROM dbo.EventFlow AS e
INNER JOIN dbo.Category AS c
    ON c.CategoryId = e.CategoryId
INNER JOIN dbo.Venue AS v
    ON v.VenueId = e.VenueId
INNER JOIN dbo.Organizer AS o
    ON o.OrganizerId = e.OrganizerId;
GO

SELECT
   *
FROM dbo.vw_EventOverview
ORDER BY StartAt;
