# Verksamhetsregler – EventFlow

## Relationer i båda riktningarna

### Visitor och Registration
- En besökare kan ha noll eller många anmälningar.
- Varje anmälan tillhör exakt en besökare.

### Event och Registration
- Ett event kan ha noll eller många anmälningar.
- Varje anmälan gäller exakt ett event.

### Organizer och Event
- En arrangör kan skapa noll eller många event.
- Varje event har exakt en arrangör.

### Category och Event
- En kategori kan innehålla noll eller många event.
- Varje event tillhör exakt en kategori.

### Venue och Event
- En plats kan användas för inga eller många event över tid.
- Varje event hålls på exakt en plats.

### Obligatoriska och valfria relationer
- Obligatorisk: Registration måste hänvisa till både en Visitor och ett Event.
- Valfri: En Visitor får finnas utan någon Registration.

### 1:N-relation
En Organizer kan skapa flera Event, men varje Event har
exakt en Organizer. Relationen är 1:N och lagras genom
Event.FkOrganizerId → Organizer.OrganizerId.

### N:M-relation med kopplingsentitet
En Visitor kan anmäla sig till flera Event, och ett Event
kan ha flera Visitor.

N:M-relationen löses med kopplingsentiteten Registration:
- Registration.FkVisitorId → Visitor.VisitorId.
- Registration.FkEventId → Event.EventId.
- RegistrationId är primärnyckel.
- RegisteredAt anger när anmälan gjordes.

### Föreslagen unikhetsregel
En besökare får ha högst en anmälan till samma event.
Kombinationen (FkVisitorId, FkEventId) ska därför vara unik.

### Beslut att bekräfta
- Teamet behöver bekräfta:
att varje event måste ha en arrangör, kategori och plats
- att samma plats kan användas för flera event över tid
att dubbla anmälningar till samma event inte är tillåtna
