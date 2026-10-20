# Normalisering – från v1 (platt tabell) till v2 (normaliserad modell)

## Avgränsning och underlag
- **Team:** Merge Force
- **Vald del av projektet:** Evenemang med kategori, plats, arrangör och anmälda besökare.
- **Tabeller i v2:** Category, Venue, Organizer, Visitor, Event, Registration.
- **Antaganden och verksamhetsregler:**
  - Ett evenemang tillhör exakt en kategori, en plats och en arrangör.
  - En besökare kan anmäla sig till många evenemang, och ett evenemang kan ha många besökare (N:M), vilket löses med kopplingsentiteten Registration.
- **Före-modell v1:** [länk till den platta FöreLäge-tabellen / diagram]
- **Efter-modell v2:** [länk till det normaliserade ER-diagrammet]
- **Exempeldata:** docs/normalisering-exempel.xlsx (flikar v1_ och v2_)

---

## 1. Före-läge – v1 (platt tabell)

All information ligger i en enda tabell, "FöreLäge", med en rad per kombination av evenemang och besökare:

| Event | Details | Category | VenueName | VenueAddress | VisitorName | VisitorEmail | OrganizerName | OrganizerEmail |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Coding Night | Öva programmering tillsammans | Teknik | Studenthuset | Exempelväg | Robin Berg | robin@exempel.se | Umeå Studentförening | kontakt@exempel.se |
| Musikkväll | Lyssna på livemusik | Musik | Studenthuset | Exempelväg | Dana Ek | dana@exempel.se | Umeå Studentförening | kontakt@exempel.se |

### Exempeldata och upprepning
- Exempelrader finns i fliken **v1_ForeLage**.
- **Duplicerade beskrivande fakta:**
  - Platsen (Studenthuset, Exempelväg) upprepas på varje rad.
  - Arrangören (Umeå Studentförening, kontakt@exempel.se) upprepas på varje rad.
- Detta är **redundans** – samma fakta lagras på flera platser, vilket leder till anomalierna nedan.

### Situationer att testa
1. **Ändra** arrangörens e-post (Umeå Studentförening). Berörda: alla rader där arrangören förekommer.
2. **Lägg till** en ny plats som ännu inte används av något evenemang.
3. **Ta bort** ett evenemang. Berörda: raden för evenemanget och den data som delar rad med det.

---

## 2. Kontroll av normalformer

### 1NF
- **Kontroll:** ett värde per cell, inga listor eller upprepade kolumngrupper, och identifierbara rader.
- **v1:** Varje cell innehåller visserligen ett värde, men tabellen saknar en tydlig primärnyckel och blandar fakta om flera objekt. 
- **Ändring för v2:** Varje tabell får en egen primärnyckel (EventId, CategoryId, VenueId, OrganizerId, VisitorId, RegistrationId) så att varje rad kan identifieras unikt. 1NF uppfylls.

### 2NF
- **Kandidatnycklar:** I v2 har varje tabell en enkel (icke sammansatt) primärnyckel.
- **Kontroll:** Finns icke-nyckelattribut som beror på bara en del av en sammansatt nyckel? Nej – eftersom nycklarna är enkla kan inget attribut bero på "en del" av nyckeln.
- **Ändring för v2:** Den enda många-till-många-relationen (Visitor ↔ Event) löstes med kopplingsentiteten **Registration**, som har en egen nyckel (RegistrationId) och attributet RegisteredAt (som beror på själva anmälan). 2NF uppfylls.

### 3NF
- **Kontroll:** Finns icke-nyckelattribut som beror på nyckeln via andra icke-nyckelattribut?
- **v1:** Ja. T.ex. berodde OrganizerEmail egentligen på arrangören (OrganizerName), inte på evenemanget, och VenueAddress berodde på platsen, inte på evenemanget. Det är brott mot 3NF.
- **Ändring för v2:** Fakta om andra objekt flyttades till egna tabeller:
  - **Category** (CategoryId, Name)
  - **Venue** (VenueId, Name, Address)
  - **Organizer** (OrganizerId, Name, Email)
  - **Visitor** (VisitorId, Name, Email)
  
  Event pekar på Category, Venue och Organizer via främmande nycklar. 3NF uppfylls.

---

## 3. Efter-läge – v2 (normaliserad modell)

| Tabell | Ansvar | PK | FK och refererad tabell |
| --- | --- | --- | --- |
| Category | Lagrar kategorier | CategoryId | – |
| Venue | Lagrar platser (namn, adress) | VenueId | – |
| Organizer | Lagrar arrangörer (namn, e-post) | OrganizerId | – |
| Visitor | Lagrar besökare (namn, e-post) | VisitorId | – |
| Event | Lagrar evenemanget (titel, detaljer) | EventId | CategoryId → Category, VenueId → Venue, OrganizerId → Organizer |
| Registration | Kopplar besökare till evenemang + när | RegistrationId | VisitorId → Visitor, EventId → Event |

### Motiverade beslut
- Vi **delade upp** den platta tabellen eftersom beskrivande fakta (plats, arrangör, besökare, kategori) upprepades och orsakade anomalier.
- Vi **löste N:M-relationen** (Visitor ↔ Event) med kopplingsentiteten Registration.
- Kopplingarna bevaras genom främmande nycklar, så att den ursprungliga informationen kan läsas ihop igen utan redundans.

---

## 4. Testresultat

Testerna görs manuellt i kalkylarket. De granskar modellen, inte en implementerad databas.

| Situation och berörda id | Förväntat resultat | Resultat i v1 | Resultat i v2 | Slutsats |
| --- | --- | --- | --- | --- |
| **Test 1 (ändra):** Ändra arrangörens e-post (Umeå Studentförening) | E-posten ska ändras på endast ett ställe | Måste ändras på **varje rad** där arrangören förekommer (2 rader); missar man en blir datan motstridig | Ändras på **en rad** i Organizer; alla evenemang ser rätt e-post via OrganizerId | v2 löser **uppdateringsanomalin** – fakta finns bara på ett ställe |
| **Test 2 (lägg till):** Lägg till en ny plats (V2) som inte används av något evenemang | Platsen ska kunna läggas till utan ett evenemang | Går **inte** – i den platta tabellen finns plats bara som en del av en evenemangsrad, så en plats utan evenemang kan inte lagras | Går att lägga till som en ny rad i Venue, helt oberoende av Event | v2 löser **inmatningsanomalin** – platsdata är oberoende |
| **Test 3 (ta bort):** Ta bort ett evenemang (Musikkväll) | Endast evenemangets egen data ska tas bort | Hela raden tas bort, vilket **också raderar** besökaren Dana Ek och hennes e-post, eftersom de bara fanns på den raden | Endast raden i Event (och ev. i Registration) tas bort; Visitor, Category, Venue och Organizer är kvar | v2 löser **raderingsanomalin** – fristående data förloras inte |

---

## 5. Sammanfattning och kvarstående frågor
- **Viktigaste slutsatsen:** Den platta v1-tabellen led av redundans och alla tre anomalierna. Genom att dela upp informationen i egna tabeller med primär- och främmande nycklar (v2) lagras varje faktum på ett ställe och anomalierna försvinner.
- **Minskad redundans:** Plats-, arrangörs-, kategori- och besökardata lagras nu en gång var i stället för att upprepas.
- **Kvarstående frågor eller antaganden att kontrollera:** [t.ex. om samma besökare får anmäla sig till samma evenemang flera gånger]

**En mening per normalform:**
- **1NF:** Vi gav varje tabell en primärnyckel så att varje rad kan identifieras, och varje cell innehåller ett värde.
- **2NF:** Eftersom tabellerna har enkla primärnycklar kan inget icke-nyckelattribut bero på bara en del av en sammansatt nyckel.
- **3NF:** Vi flyttade fakta om andra objekt (plats, arrangör, kategori, besökare) till egna tabeller, så inget icke-nyckelattribut beror på nyckeln via ett annat icke-nyckelattribut.
