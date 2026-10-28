USE EventFlowDB
GO


CREATE PROCEDURE usp_GetEventByCategory 
	@CategoryName NVARCHAR(100)
AS
BEGIN
SELECT
	EventId,
	Title,
	EventDate,
	CategoryName
FROM dbo.vw_EventOverview
WHERE CategoryName = @CategoryName
END;
GO

EXEC usp_GetEventByCategory Musik;

-- Test: Sortera Events efter Category namn.
