# API-dokumentation

## Användarbehov
Som system vill jag hämta eventdata från det tillhandahållna externa API:et med fetch och async/await, hantera statuskoder samt visa korrekta UI-lägen.

## Bas-URL och endpoint
https://github.com/m-lindberg/eventflow-api.git

Endpoints - /events

## HTTP-metod
GET 

## Exempel på svar
JSON ARRAY med eventobjekt 

## Fält som används
Title, Category, Event, Venue, Organizer, id and StartsAt

## Loading-, empty-, success- och error-läge
Loading - Visar en laddningsindikator medan fetch pågår. "Hämtar events"

Success - Renderar ut evenemangskoden i DOM med säkra metoder som createElement och textContent när datan hämtas. 

Empty - Visar ett meddelande om API-svaret är en tom lista []. "Det finns inga events att visa"

Error - Fångar upp nätverksfel eller http-fel och visar sedan ett tydligt meddelande för användaren. "Tjänsten har problem, försök igen senare"

## Säkerhets- och integritetshänsyn
HTTPS används för krypterad kommunikation. Ingen känslig användardata skickas till det API:et.

## Kända begränsningar
Inga riktiga biljetter eller event. 


## Testresultat
| Scenario | testadress | Förväntat | Faktiskt resultat | Bedömning |
| --- | --- | --- | --- | --- |
| Giltig respons | /api/events | Data visas  |  Status - 200 OK, Visar evenemang i arraytabell | Godkänt |
| Tom data | /api/test/empty |  Empty visas | Visar ett tomt tillstånd meddelande med [ ] | Godkänt |
| Serverfel | /api/test/error  | Error visas |  Status 500, simulerat serverfel. | Godkänt  |
| Felaktig sökväg | Tillfälligt ändrad URL | Error visas |  Ingen respons   |  Godkänt  |
| Nätverksfel | Devstools offline | Error visas |  Try.. catch fångar upp nätverksfelet och visar felmeddelande i UI. |  Godkänt  |
