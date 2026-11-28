[English](README-en.md)
# EventFlow – MergeForce

## Syfte och målgrupp
Projektet är en webbapplikation för kommunens invånare att hitta och söka efter evenemang och registrera sig till dem. Evenemangen är sorterade i kategorier och har en detaljvy som visar allt invånaren behöver veta innan de registrerar sig, som datum, starttid och plats.

## Kundvärde
Kommunens invånare får ett ställe där alla kommande evenemang visas. Arrangörer kan dessutom se hur många som har registrerat sig till ett evenemang, så att de kan planera för alla deltagare.

## Centralt användarflöde
Användaren öppnar webbsidan → kommande evenemang visas på framsidan → användaren kan söka efter titel och filtrera efter kategori → klickar på ett evenemang för att se detaljer → klickar på registreringsknappen i detaljvyn för att komma till registreringsformuläret → fyller i sina uppgifter för att anmäla sig till evenemanget.

## Tekniker
HTML, CSS, JavaScript, C#/.NET 10, REST API/JSON, Fetch API, SQL Server, Git/GitHub

## Mappstruktur
```
K2-UmeaTeam/
├── database/                  # Alla SQL-skript (tabeller, vyer, trigger, testdata)
│   ├── 01_...sql
│   └── ...
├── docs/                      # Projektdokumentation
│   ├── api.md                 # Dokumentation av API-användning
│   ├── business-rules.md      # Verksamhetsregler
│   ├── Database-Notes.md      # Databasmodell
│   ├── team-rules.md          # Teamregler
│   ├── ForelageERDmodel.png   # Första version av databasmodell
│   ├── Interaktiv-användarflöde.md     # Interaktivt användarflöde
│   ├── Robust API-flöde och formaliserad review.md
│   ├── daily-log.md           # Scrum möte log
│   ├── erdplus.png            # ERD model i chen notation
│   ├── felmatris.md           # API-statusmatris
│   ├── normalisering-exempel.xlsx      # Normalisering av databasmodell.
│   ├── testmatris.md          # testmatris för registreringsformuläret
│   ├── product-vision.md      # projektets målgrupp och vision.
│   ├── spårbarhetstabell.md   # Användarbehov tabell
│   ├── ERDmodel.png           # ER-diagram över databasen
│   └── normalization.md       # Normalisering av datamodellen
├── EventflowUmu-Frontend/     # Webbgränssnittet
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── ...
└── README.md
```

## Installation och start
### 1. Klona projektet
```powershell
git clone https://github.com/valentincorceac/K2-UmeaTeam.git
```
### 2. Klona och starta API:et 
```powershell
git clone https://github.com/m-lindberg/eventflow-api.git
cd eventflow-api
dotnet run --urls http://localhost:5043
```
### 3. Kör SQL-skripten

SQL-skripten bygger upp projektets databas (tabeller, vyer, trigger och testdata).

**Obs:** Databasen är ett eget leverabel som visar vår datamodellering.
Webbsidan hämtar i nuläget sin data från det externa API:et (se avsnittet om
externt API), inte från den här databasen. SQL-delen och webbsidan är alltså
fristående i det här projektet.

#### Förutsättningar
- SQL Server samt SQL Server Management Studio (SSMS).

#### Steg
1. Öppna SSMS och anslut till din SQL Server-instans.
2. Kör skripten i följande ordning (filerna finns i mappen `database/`):

   1. `01-schema.sql` – skapar databasen och tabellerna
   2. `02-data.sql` – databas testdata.
   3. `03-queries.sql` – join frågor.
   4. `04-procedures.sql` - SQL-procedur för att sortera efter kategori
   5. `05-queries.sql` - join fråger
   6. `06-triggers.sql` - skapar trigger som loggar alla nya anmälningar automatiskt
   7. `07-trigger-tests.sql` - testar trigger
   8. `08-views.sql` – view för att se all information om evenemang.

3. Kör varje skript i tur och ordning (öppna filen → kör med F5).

### 4. Starta webbgränssnittet
Webbsidan behöver köras via en lokal webbserver (inte öppnas direkt som en fil),
eftersom den hämtar data från API:et med fetch.

1. Öppna projektet i VS Code.
```powershell
cd K2-UmeaTeam
code .
```
2. Installera tillägget "Live Server".
3. Högerklicka på `index.html` → "Open with Live Server".
4. Sidan öppnas på t.ex. http://127.0.0.1:5500.

OBS: API:et måste köras först (se avsnittet om externt API), annars visas inga evenemang.

## Externt API och kända begränsningar

Webbsidan hämtar evenemangsdata från ett externt API som tillhandahålls av
kursledaren (separat repo, se "Klona och starta API:et" ovan).
API:et returnerar en JSON-array med evenemang.

**Bas-URL:** `http://localhost:5043/api/events`

### Kända begränsningar
- API:et innehåller en **fast uppsättning evenemang** – det går inte att
  lägga till, ändra eller ta bort evenemang via API:et.
- **Registreringar sparas inte** någonstans – anmälningsformuläret visar
  bekräftelse i gränssnittet men datan lagras inte i API:et eller en databas.
- API:et körs över **HTTP (localhost)**, inte HTTPS, och kräver **ingen
  autentisering**.
- API:et måste köras lokalt; det finns ingen publik/driftsatt version.
- Eftersom datan är statisk återspeglar datum i testdatan inte riktiga,
  aktuella evenemang.

## Testinstruktioner

Testningen görs manuellt i webbläsaren. API:et måste köras först.

### Webbgränssnittet
1. Starta API:et och öppna webbsidan via Live Server.
2. Klicka på "Load Events" – kontrollera att evenemang visas som kort.
3. Kontrollera att statusmeddelandet visar antal hämtade evenemang.
4. Testa sökfältet – skriv en titel och kontrollera att listan filtreras.
5. Testa kategorifiltret – välj en kategori och kontrollera att endast
   matchande evenemang visas.
6. Klicka på ett evenemangskort – kontrollera att detaljvyn (dialog) öppnas
   med rätt information, och att den går att stänga.
7. Fyll i anmälningsformuläret:
   - Lämna fält tomma → kontrollera att felmeddelande visas.
   - Ange ogiltig e-post/telefon → kontrollera att validering fångar det.
   - Fyll i korrekt → kontrollera att bekräftelse visas.

### Felhantering
8. Stäng av API:et och klicka "Load Events" – kontrollera att ett
   felmeddelande visas (inte en krasch).

### Databas (SQL)
9. Kör testskriptet för triggern i en transaktion (BEGIN TRANSACTION /
   ROLLBACK) och kontrollera att loggtabellen uppdateras som förväntat.

## Säkerhets- och integritetsbeslut

- **HTTP i utvecklingsmiljö:** API:et anropas över HTTP (localhost) under
  utveckling. I en produktionsmiljö bör HTTPS användas så att data krypteras
  under överföring.

- **Ingen autentisering:** API:et är öppet och levererar endast offentlig
  evenemangsinformation (titel, datum, plats). Eftersom datan är offentlig är
  integritetsrisken vid hämtning låg. En skarp lösning med privat data skulle
  kräva autentisering och behörighetskontroll.

- **Personuppgifter (GDPR):** Anmälningsformuläret samlar in namn, e-post och
  telefonnummer, vilket är personuppgifter enligt GDPR. I det här projektet
  används endast påhittade testuppgifter och ingen riktig persondata lagras.
  En skarp lösning skulle kräva laglig grund, tydlig information till användaren
  och säker lagring.

- **XSS (cross-site scripting):** Data från API:et renderas i DOM:en. Där vi
  bygger innehåll från API-data är vi medvetna om att `textContent` är säkrare
  än `innerHTML`, eftersom `innerHTML` kan tolka inmatad data som HTML. Eftersom
  API:et är betrott är risken låg, men det är en medveten avvägning.

## Git-workflow

1. Uppdatera main med git pull.
2. Skapa en feature-branch.
3. Gör små och begripliga commits.
4. Pusha branchen till GitHub.
5. Öppna en Pull Request och beskriv ändringarna.
6. Låt minst en annan teammedlem granska.
7. Åtgärda feedback och lös diskussioner.
8. Merge till main efter godkännande.

## Kanban-tavla

- **Backlog:** Idéer och framtida uppgifter.
- **Ready:** Uppgifter som uppfyller Definition of Ready.
- **In Progress:** Pågående arbete.
- **Review / PR:** Väntar på granskning.
- **Done:** Klart enligt Definition of Done och mergat.
