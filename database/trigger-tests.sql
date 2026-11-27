-- Fråga: Vad testar skriptet?
-- Svar: Det testar att triggern skapar en loggrad per ny anmälan,
-- både när en rad läggs till och när flera rader läggs till i samma INSERT.

-- Fråga: Vilka tabeller används?
-- Svar: Testanmälningarna läggs till i dbo.Registration.
-- Triggern skriver en rad per anmälan till dbo.BR4_RegistrationLog.

-- Fråga: Vilket resultat förväntas?
-- Svar: Test 1 ska skapa en loggrad och test 2 ska skapa tre.
-- Totalt ska fyra nya loggrader visas med ActionName = 'INSERT'.

-- Fråga: Varför används ROLLBACK?
-- Svar: Testanmälningarna och loggraderna skapas i samma transaktion.
-- ROLLBACK tar tillbaka båda ändringarna efter testet.

USE EventFlowDB;
GO

-- Besökarna och evenemangen måste finnas i testdatabasen.
-- Om samma besökare bara får anmäla sig en gång per evenemang
-- behöver kombinationerna vara lediga före körningen.

BEGIN TRANSACTION;

    -- Test 1: Lägger till en anmälan.
    INSERT INTO dbo.Registration (VisitorId, EventId, RegisteredAt)
    VALUES (1, 1, SYSDATETIME());

    -- Test 2: Lägger till tre anmälningar i samma INSERT.
    INSERT INTO dbo.Registration (VisitorId, EventId, RegisteredAt)
    VALUES
        (2, 1, SYSDATETIME()),
        (2, 2, SYSDATETIME()),
        (1, 3, SYSDATETIME());

    -- Visar loggen så att de fyra nya raderna kan kontrolleras.
    SELECT *
    FROM dbo.BR4_RegistrationLog
    ORDER BY LogId DESC;

ROLLBACK TRANSACTION;
GO
