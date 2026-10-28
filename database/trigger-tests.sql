USE EventFlowDB;
GO
-- Kör endast mot en lokal testkopia, inte en driftmiljö.
/* Kör endast i den separata EventFlowDB efter schema, data och triggers.
   Ett fel avbryter testet. Alla testrader återställs med ROLLBACK.
   IDENTITY-räknare kan få luckor efter rollback; det är normalt.
   Förväntat: en rad -> en loggrad; två rader i en sats -> två loggrader. */
IF DB_NAME() <> N'EventFlowDB'
    THROW 51000, N'Testerna får bara köras i EventFlowDB.', 1;
IF OBJECT_ID(N'dbo.BR4_RegistrationLog', N'U') IS NULL
    THROW 51000, N'Kör triggers.sql först.', 1;
IF @@TRANCOUNT > 0
    THROW 51000, N'Avsluta den öppna transaktionen innan testerna körs.', 1;
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    DECLARE @VisitorId INT, @EventId INT;
    SELECT TOP (1) @VisitorId = VisitorId FROM dbo.Visitor ORDER BY VisitorId;
    SELECT TOP (1) @EventId = EventId FROM dbo.EventFlow ORDER BY EventId;
    IF @VisitorId IS NULL OR @EventId IS NULL
        THROW 51000, N'Testdata saknas.', 1;
    -- Variablerna ovan väljer testunderlag. Triggern använder inga skalära id:n.
    DECLARE @Ids TABLE (RegistrationId INT PRIMARY KEY);
    INSERT INTO dbo.Registration (RegisteredAt, VisitorId, EventId)
    OUTPUT inserted.RegistrationId INTO @Ids
    VALUES ('2026-10-28T09:00:00', @VisitorId, @EventId);
    IF (SELECT COUNT(*) FROM dbo.BR4_RegistrationLog AS l
        INNER JOIN @Ids AS x ON x.RegistrationId = l.RegistrationId) <> 1
        THROW 51001, N'Enradstest: förväntade en loggrad.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.BR4_RegistrationLog AS l
        INNER JOIN @Ids AS x ON x.RegistrationId = l.RegistrationId
        INNER JOIN dbo.Registration AS r ON r.RegistrationId = x.RegistrationId
        WHERE l.VisitorId <> r.VisitorId OR l.EventId <> r.EventId
           OR l.RegisteredAt <> r.RegisteredAt OR l.ActionName <> N'INSERT')
        THROW 51002, N'Enradstest: fel logginnehåll.', 1;
    SELECT N'Enradstest OK' AS Testresultat;
    ROLLBACK TRANSACTION;

    BEGIN TRANSACTION;
    DELETE FROM @Ids;
    INSERT INTO dbo.Registration (RegisteredAt, VisitorId, EventId)
    OUTPUT inserted.RegistrationId INTO @Ids
    VALUES ('2026-10-28T09:01:00', @VisitorId, @EventId),
           ('2026-10-28T09:02:00', @VisitorId, @EventId);
    IF (SELECT COUNT(*) FROM dbo.BR4_RegistrationLog AS l
        INNER JOIN @Ids AS x ON x.RegistrationId = l.RegistrationId) <> 2
        THROW 51003, N'Flerradstest: förväntade två loggrader.', 1;
    IF EXISTS (
        SELECT x.RegistrationId FROM @Ids AS x
        LEFT JOIN dbo.BR4_RegistrationLog AS l ON l.RegistrationId = x.RegistrationId
        GROUP BY x.RegistrationId HAVING COUNT(l.LogId) <> 1)
        THROW 51004, N'Flerradstest: varje id måste ha exakt en loggrad.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.BR4_RegistrationLog AS l
        INNER JOIN @Ids AS x ON x.RegistrationId = l.RegistrationId
        INNER JOIN dbo.Registration AS r ON r.RegistrationId = x.RegistrationId
        WHERE l.VisitorId <> r.VisitorId OR l.EventId <> r.EventId
           OR l.RegisteredAt <> r.RegisteredAt OR l.ActionName <> N'INSERT')
        THROW 51005, N'Flerradstest: fel logginnehåll.', 1;
    SELECT N'Flerradstest OK' AS Testresultat;
    SELECT l.* FROM dbo.BR4_RegistrationLog AS l
    INNER JOIN @Ids AS x ON x.RegistrationId = l.RegistrationId;
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
/* Den isolerade grundmodellen saknar ännu UNIQUE(VisitorId, EventId).
   Testerna använder därför samma kombination för att isolera loggningen.
   Kör inte dessa tester mot en modell med andra regler utan anpassning. */
