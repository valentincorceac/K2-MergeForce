  -- Fråga: Vilken verksamhetsfråga vyn besvarar
  -- Svar: Se hela våran information ifrån databasen.
  
  -- Fråga: Vad en resultatrad representerar
  -- Svar: Information som sparar i tabell view.

  -- Fråga: vilka tabeller som används
  -- Svar: Alla tabeller har används.

  -- Fråga: hur vyn har testats
  -- Svar: Vi använde CREATE VIEW som vi sedan testade med våran testdata. Genom SELECT * FROM dbo.vw_EventOverview.


USE EventFlowDB
GO

CREATE VIEW dbo.vw_EventOverview
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
    o.Email AS organizerEmail,
    r.RegisteredAt,
    vi.VisitorName,
    vi.Email AS VisitorEmail,
    vi.PhoneNumber
FROM dbo.EventFlow AS e
INNER JOIN dbo.Category AS c
    ON c.CategoryId = e.CategoryId
INNER JOIN dbo.Venue AS v
    ON v.VenueId = e.VenueId
INNER JOIN dbo.Organizer AS o
    ON o.OrganizerId = e.OrganizerId
INNER JOIN Registration AS r
    ON e.EventId = r.EventId
INNER JOIN Visitor AS vi
    ON vi.VisitorId = r.VisitorId;
GO

SELECT
   *
FROM dbo.vw_EventOverview
ORDER BY StartAt;
