Användarbehov	Databasstöd	Frontendstöd	Acceptanskriterium

| Användarbehov   | Databasstöd | Frontendstöd | Acceptanskriterium
| ----------- | ----------- | ----------- | ----------- |
| Hitta evenemang och läsa detaljer    |  En view kombinerar eventflow, kategori, venue och organizer som visar upp detaljer |Responsiva innehållskort visar titel, datum, plats och arrangör. |Samma eventuppgifter visas i vyn och i frontendens statiska exempeldata. Korten går att läsa på både smal och bred skärm utan horisontell scroll.       |
| Anmäla sig till evenemang  | En register tabell kopplar en visitor tabell till event | Besökaren kan fylla i ett formulär och skicka iväg det | Giltiga namn, e-post och mobilnummer|
| Filtrera evenemang baserad på kategori  | Stored procedure som filtrering kategori namn och hämtar alla events under den| Filtermeny där användaren kan välja kategori| Kategorier kan hämtas från databasen och visas upp |

