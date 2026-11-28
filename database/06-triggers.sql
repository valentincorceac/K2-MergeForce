-- Fråga: Vilken verksamhetsfråga besvarar loggen?
-- Svar: Vilka anmälningar skapades, vem anmälde sig, till vilket evenemang
-- och när registrerades anmälan i loggen?

-- Fråga: Vad representerar en rad i loggtabellen?
-- Svar: En rad motsvarar en ny anmälan. RegisteredAt är anmälans tid,
-- medan LoggedAt är tiden då loggraden skapades, angiven i UTC.

-- Fråga: Vilka tabeller används?
-- Svar: Nya anmälningar läggs till i dbo.Registration. Triggern läser
-- de nya raderna från inserted och skriver dem till dbo.BR4_RegistrationLog.

-- Fråga: När körs triggern?
-- Svar: Den körs efter en INSERT i dbo.Registration. Om samma INSERT
-- lägger till flera anmälningar skapas en loggrad för varje anmälan.

-- Fråga: Hur kan triggern testas?
-- Svar: Lägg först till en giltig testanmälan och sedan två giltiga
-- testanmälningar i samma INSERT. Kontrollera med frågan längst ner
-- att varje ny anmälan fick exakt en loggrad med ActionName = 'INSERT'.

USE EventFlowDB;
GO

-- Skapar tabellen som sparar historik för nya anmälningar.
CREATE TABLE dbo.BR4_RegistrationLog
(
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    RegistrationId INT NOT NULL,
    VisitorId INT NOT NULL,
    EventId INT NOT NULL,
    RegisteredAt DATETIME2 NOT NULL,
    LoggedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ActionName NVARCHAR(10) NOT NULL
);
GO

-- Loggar automatiskt alla nya anmälningar.
CREATE TRIGGER dbo.trg_BR4_Registration_Insert
ON dbo.Registration
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.BR4_RegistrationLog
        (RegistrationId, VisitorId, EventId, RegisteredAt, ActionName)
    SELECT
        i.RegistrationId,
        i.VisitorId,
        i.EventId,
        i.RegisteredAt,
        N'INSERT'
    FROM inserted AS i;
END;
GO

-- Visar de senaste loggraderna efter att testanmälningarna har lagts till.
SELECT *
FROM dbo.BR4_RegistrationLog
ORDER BY LogId DESC;
