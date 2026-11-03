USE EventFlowDB;
GO


-- Kör i teamets databas som innehåller dbo.Registration.

-- Skapar en enkel loggtabell.
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

-- Loggar alla nya anmälningar automatiskt med ett trigger.
CREATE TRIGGER dbo.trg_BR4_Registration_Insert
ON dbo.Registration
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.BR4_RegistrationLog
        (RegistrationId, VisitorId, EventId, RegisteredAt, ActionName)
    SELECT i.RegistrationId, i.VisitorId, i.EventId,
           i.RegisteredAt, N'INSERT'
    FROM inserted AS i;
END;
GO
