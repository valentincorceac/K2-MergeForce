Get - Anrop http://localhost:5043/api/events 


Möjlig konsekvens  - 🟢 Grön: skriver inget till databasen. 


Osäkerheter - 🟡 Gul: Fel i datamappningen eller återställningen av gränssnittet kan ge gamla kort, fel besked eller en knapp som inte går att använda igen. Inget som visas när anropet pågår. 


Nödvändiga test - 🟡 Gul.  Bör kontrollera kedjan fetch → HTTP-status → JSON → validering → DOM, samt vad som händer vid tom lista eller fel. Slow, Offline och fast network i devtools.


Vilka delar som kräver särskild mänsklig review 🔴 Röd: Allt som hanterar personuppgifter och känslig data.


