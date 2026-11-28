[Svenska](README.md)

# EventFlow – MergeForce

## Purpose and target audience
EventFlow is a web application that lets a municipality's residents find and search for events and register for them. The events are sorted into categories and have a detail view that shows everything a resident needs to know before registering, such as date, start time and location.

## Customer value
Residents get a single place where all upcoming events are shown. Organizers can also see how many people have registered for an event, so they can plan for all participants.

## Main user flow
The user opens the website → upcoming events are shown on the front page → the user can search by title and filter by category → clicks an event to see details → clicks the registration button in the detail view to reach the registration form → fills in their information to sign up for the event.

## Technologies
HTML, CSS, JavaScript, C#/.NET 10, REST API/JSON, Fetch API, SQL Server, Git/GitHub

## Folder structure
```
K2-UmeaTeam/
├── database/                  # All SQL scripts (tables, views, triggers, test data)
│   ├── 01-schema.sql
│   └── ...
├── docs/                      # Project documentation
│   ├── api.md                 # Documentation of API usage
│   ├── business-rules.md      # Business rules
│   ├── Database-Notes.md      # Database model
│   ├── team-rules.md          # Team rules
│   ├── ForelageERDmodel.png   # First version of the database model
│   ├── Interaktiv-användarflöde.md     # Interactive user flow
│   ├── Robust API-flöde och formaliserad review.md
│   ├── daily-log.md           # Scrum meeting log
│   ├── erdplus.png            # ERD model in Chen notation
│   ├── felmatris.md           # API status matrix
│   ├── normalisering-exempel.xlsx      # Normalization of the database model
│   ├── testmatris.md          # Test matrix for the registration form
│   ├── product-vision.md      # The project's target audience and vision
│   ├── spårbarhetstabell.md   # User-needs traceability table
│   ├── ERDmodel.png           # ER diagram of the database
│   └── normalization.md       # Normalization of the data model
├── EventflowUmu-Frontend/     # The web interface
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── ...
└── README.md
```

## Installation and startup
### 1. Clone the project
```powershell
git clone https://github.com/valentincorceac/K2-UmeaTeam.git
```
### 2. Clone and start the API
```powershell
git clone https://github.com/m-lindberg/eventflow-api.git
cd eventflow-api
dotnet run --urls http://localhost:5043
```
### 3. Run the SQL scripts

The SQL scripts build the project's database (tables, views, triggers and test data).

**Note:** The database is a separate deliverable that demonstrates our data modeling.
The website currently fetches its data from the external API (see the "External API"
section), not from this database. The SQL part and the website are therefore
independent in this project.

#### Prerequisites
- SQL Server and SQL Server Management Studio (SSMS).

#### Steps
1. Open SSMS and connect to your SQL Server instance.
2. Run the scripts in the following order (the files are in the `database/` folder):

   1. `01-schema.sql` – creates the database and tables
   2. `02-data.sql` – database test data
   3. `03-queries.sql` – join queries
   4. `04-procedures.sql` – SQL procedure for sorting by category
   5. `05-queries.sql` – join queries
   6. `06-triggers.sql` – creates a trigger that automatically logs all new registrations
   7. `07-trigger-tests.sql` – tests the trigger
   8. `08-views.sql` – view for seeing all information about an event

3. Run each script in order (open the file → run with F5).

### 4. Start the web interface
The website needs to be run through a local web server (not opened directly as a file),
because it fetches data from the API with fetch.

1. Open the project in VS Code.
```powershell
cd K2-UmeaTeam
code .
```
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".
4. The page opens at e.g. http://127.0.0.1:5500.

NOTE: The API must be running first (see the External API section), otherwise no events are shown.

## External API and known limitations

The website fetches event data from an external API provided by the course
instructor (separate repo, see "Clone and start the API" above).
The API returns a JSON array of events.

**Base URL:** `http://localhost:5043/api/events`

### Known limitations
- The API contains a **fixed set of events** – events cannot be added,
  changed or removed through the API.
- **Registrations are not saved** anywhere – the registration form shows a
  confirmation in the interface, but the data is not stored in the API or a database.
- The API runs over **HTTP (localhost)**, not HTTPS, and requires **no
  authentication**.
- The API must be run locally; there is no public/deployed version.
- Because the data is static, the dates in the test data do not reflect real,
  current events.

## Test instructions

Testing is done manually in the browser. The API must be running first.

### Web interface
1. Start the API and open the website via Live Server.
2. Click "Load Events" – check that events are shown as cards.
3. Check that the status message shows the number of fetched events.
4. Test the search field – type a title and check that the list is filtered.
5. Test the category filter – select a category and check that only
   matching events are shown.
6. Click an event card – check that the detail view (dialog) opens
   with the correct information, and that it can be closed.
7. Fill in the registration form:
   - Leave fields empty → check that an error message is shown.
   - Enter an invalid email/phone number → check that validation catches it.
   - Fill in correctly → check that a confirmation is shown.

### Error handling
8. Turn off the API and click "Load Events" – check that an
   error message is shown (not a crash).

### Database (SQL)
9. Run the trigger's test script in a transaction (BEGIN TRANSACTION /
   ROLLBACK) and check that the log table is updated as expected.

## Security and privacy decisions

- **HTTP in the development environment:** The API is called over HTTP (localhost)
  during development. In a production environment, HTTPS should be used so that data
  is encrypted in transit.

- **No authentication:** The API is open and delivers only public event
  information (title, date, location). Because the data is public, the privacy
  risk when fetching it is low. A production solution with private data would
  require authentication and authorization.

- **Personal data (GDPR):** The registration form collects name, email and
  phone number, which are personal data under GDPR. In this project, only
  made-up test data is used and no real personal data is stored.
  A production solution would require a legal basis, clear information to the user,
  and secure storage.

- **XSS (cross-site scripting):** Data from the API is rendered in the DOM. Where we
  build content from API data, we are aware that `textContent` is safer than
  `innerHTML`, because `innerHTML` can interpret input data as HTML. Since
  the API is trusted the risk is low, but it is a conscious trade-off.

## Git workflow

1. Update main with git pull.
2. Create a feature branch.
3. Make small and understandable commits.
4. Push the branch to GitHub.
5. Open a Pull Request and describe the changes.
6. Have at least one other team member review it.
7. Address feedback and resolve discussions.
8. Merge to main after approval.

## Kanban board

- **Backlog:** Ideas and future tasks.
- **Ready:** Tasks that meet the Definition of Ready.
- **In Progress:** Work in progress.
- **Review / PR:** Waiting for review.
- **Done:** Finished according to the Definition of Done and merged.
