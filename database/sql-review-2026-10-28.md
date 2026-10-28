# SQL review och triggerloggning

Granskningsdatum: 28 oktober 2026.
Underlag: main vid commit 0a5a3c35fe918aa48d156e71bd4d73a8a9c4d365.
Omfattning: samtliga sex SQL-filer i database samt de nya triggerfilerna.
Detta är AI-assisterad kodgranskning, inte ett godkännande från en annan teammedlem. Inga tidigare filer har raderats eller ändrats i detta tillägg.

## Nya filer och körordning
1. Återanvänd teamets lokala EventFlowDB med befintliga tabeller och testdata. Kör inte 01-schema.sql eller 02-data.sql igen mot en redan fylld databas.
2. Kör database/triggers.sql. Den skapar loggtabellen om den saknas och skapar eller uppdaterar triggern.
3. Kör database/trigger-tests.sql i en lokal testkopia. Förväntat är Enradstest OK och Flerradstest OK. Testerna kontrollerar antal loggrader och matchande värden och gör ROLLBACK.

En resultatrad i loggen representerar en skapad anmälan. RegistrationId, VisitorId, EventId och RegisteredAt är kopierade värden; LoggedAt är loggningstid i UTC. Triggern loggar bara nya INSERT, inte UPDATE, DELETE eller gamla rader.

## Fynd i befintliga SQL-filer

### 01-schema.sql
PK/FK och obligatoriska fält finns. Organizer.Email och Visitor.Email är nu UNIQUE. CREATE DATABASE och CREATE TABLE förutsätter en ny databas och kan inte köras om utan fel. Inget ska raderas för att lösa det; återanvänd befintlig databas eller skapa en separat testkopia.

Registration saknar UNIQUE(VisitorId, EventId). Den tidigare föreslagna regeln om högst en anmälan per besökare och event är därför inte tekniskt införd. Det är ett modellbeslut för teamet, inte något denna triggerändring lägger till.

### 02-data.sql
Id-referenserna förutsätter nya tabeller med IDENTITY från 1. Om filen körs igen kan vissa INSERT misslyckas mot UNIQUE medan andra lyckas och skapar extra data. Filen saknar en gemensam transaktion. Använd den bara en gång efter nyskapade tabeller. Det finns också hårda blanksteg efter vissa satser; normalisera dem om SQL Server ger syntaxfel.

### 03-queries.sql
JOIN-villkoren använder nuvarande modellnamn. Aggregatet använder INNER JOIN och visar därför inte Kulturkvall som saknar anmälningar. Om frågan gäller alla evenemang behövs LEFT JOIN med COUNT(r.RegistrationId). De tre första frågorna saknar ORDER BY, trots att en kommentar beskriver en sorterad lista. Kommentarer om en resultatrad bör beskriva en enskild anmälan eller ett enskilt evenemang, inte en hel lista.

### queries.sql
Filen kan inte köras i sin nuvarande form: förklarande text är inte kommenterad och SQL använder gamla namn som Event, FkVisitorId, FkEventId, FullName och Date. Det aktuella schemat använder EventFlow, VisitorId, EventId, VisitorName och EventDate. Bevara filens historik och rätta den i en separat överenskommen ändring.

### views.sql
JOIN-kopplingarna stämmer med schemat. ALTER VIEW kräver att vyn redan finns och misslyckas på en ny databas; CREATE OR ALTER VIEW passar körordningen bättre. En vanlig view sparar frågans definition och visar aktuell data, inte en separat tabell med lagrade resultat. SELECT * bör ersättas med en kolumnlista när teamet följer uppgiftens krav på explicita kolumner.

### procedures.sql
Den nya usp_GetEventByCategory återanvänder vyn och använder @CategoryName i WHERE. För reproducerbar körning föreslås dbo-schema, CREATE OR ALTER, SET NOCOUNT ON och ORDER BY. Testa minst två giltiga värden och en kategori som saknas. Använd till exempel EXEC dbo.usp_GetEventByCategory @CategoryName = N'Musik'; och därefter N'Teknik' och N'Saknas'. Den befintliga filen visar bara ett anrop och saknar sortering.

## Granskning av de nya triggerfilerna
- Triggern använder INSERT SELECT FROM inserted och behandlar alla nya rader.
- Ingen skalär variabel väljer ut ett godtyckligt id inne i triggern.
- Loggen ingår i samma transaktion som originalets INSERT.
- Testerna hämtar giltiga FK-id:n från befintliga tabeller och kontrollerar både antal och värden.
- Testerna använder ROLLBACK även vid fel och vägrar börja med en redan öppen transaktion.
- Testerna kan ge luckor i IDENTITY-räknare. De ska inte användas för att kontrollera obruten numrering.
- Testerna förutsätter fortfarande att samma VisitorId/EventId-kombination får förekomma flera gånger. Anpassa dem om teamet inför unikhetsregeln.

## Teststatus och återstående review
Mahmoud har under den stegvisa handledningen bekräftat att tester med en respektive två nya anmälningar fungerade lokalt i SSMS. Den utökade automatiska kontrollfilen i denna commit har kodgranskats men inte körts av assistenten i SQL Server. SQL Server saknas i assistentens miljö.

En annan teammedlem behöver köra den publicerade testfilen och kontrollera:
- [ ] En ny anmälan ger exakt en korrekt loggrad.
- [ ] Två nya anmälningar i samma sats ger exakt två korrekta loggrader.
- [ ] Testdata är återställd efter ROLLBACK.
- [ ] Befintliga data och tidigare filer finns kvar.

Granskare: fylls i av teamet.
Faktiskt resultat och eventuella förbättringar: fylls i efter review.
