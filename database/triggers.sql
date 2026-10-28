USE EventFlowDB;
GO
/* Automatisk loggning av nya anmälningar.
   En loggrad skapas per ny Registration, även vid flerrads-INSERT.
   En constraint kan kontrollera giltighet men skapar inte historik.
   Befintliga anmälningar loggas inte i efterhand.
   Kör mot en lokal testdatabas innan teamets granskning. */
IF OBJECT_ID(N'dbo.BR4_RegistrationLog', N'U') IS NULL
BEGIN
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
END;
GO
/* Loggen saknar avsiktligt FK till källraderna: en historisk
   ögonblicksbild ska kunna finnas kvar om originalet tas bort.
   inserted är SQL Servers tabell med samtliga nya rader.
   SET NOCOUNT ON döljer extra radantalsmeddelanden. */
CREATE OR ALTER TRIGGER dbo.trg_BR4_Registration_Insert
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
