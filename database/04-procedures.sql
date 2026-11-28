-- Fråga: Vilken verksamhetsfråga besvarar proceduren?
-- Svar: Vilka evenemang finns i en viss kategori, till exempel Musik?

-- Fråga: Vad representerar en rad i resultatet?
-- Svar: Varje rad visar ett evenemang i den valda kategorin,
-- med evenemangets ID, titel, datum och kategorinamn.

-- Fråga: Vilka tabeller används?
-- Svar: Proceduren läser från vyn dbo.vw_EventOverview.
-- Vyn hämtar sina uppgifter från EventFlow, Category, Venue och Organizer.

-- Fråga: Hur kan proceduren testas?
-- Svar: Kör proceduren med kategorin Musik och kontrollera att alla
-- resultatrader tillhör Musik. Kör sedan med en kategori som saknas
-- i testdatabasen. Då ska resultatet innehålla noll rader.

USE EventFlowDB;
GO

CREATE PROCEDURE dbo.usp_GetEventByCategory
    @CategoryName NVARCHAR(100)
AS
BEGIN
    SELECT
        EventId,
        Title,
        EventDate,
        CategoryName
    FROM dbo.vw_EventOverview
    WHERE CategoryName = @CategoryName;
END;
GO

-- Test 1: Hämtar evenemang i kategorin Musik.
EXEC dbo.usp_GetEventByCategory @CategoryName = N'Musik';

-- Test 2: En kategori som saknas ska ge noll rader.
EXEC dbo.usp_GetEventByCategory @CategoryName = N'FinnsInte';
