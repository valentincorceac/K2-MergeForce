USE EventFlowDB;
GO


BEGIN TRANSACTION;

    -- Test 1: Lägger till en rad.
    INSERT INTO dbo.Registration (VisitorId, EventId, RegisteredAt)
    VALUES (1, 1, SYSDATETIME());
    -- Förväntat: den nya anmälan finns i loggen.
    
    -- Test 2: Lägger till tre rader i samma SQL-sats.
    INSERT INTO dbo.Registration (VisitorId, EventId, RegisteredAt)
    VALUES
        (2, 1, SYSDATETIME()),
        (2, 2, SYSDATETIME()),
        (1, 3, SYSDATETIME());
    SELECT *
    FROM dbo.BR4_RegistrationLog
    ORDER BY LogId DESC;
    -- Förväntat: ytterligare tre loggrader.

ROLLBACK TRANSACTION;
GO
