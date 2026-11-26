//document.addEventListener("DOMContentLoaded", () => {
const dialog    = document.querySelector("#eventDialog");
const content   = document.querySelector("#dialogContent");
//search bar
//const searchForm = document.querySelector("#search-form");
//const searchBar = document.querySelector("#search-bar");
const eventList = document.querySelectorAll(".eventlist");
// Hämta aktuell tid från besökarens enhet.
const now = Date.now();


// Dölj evenemang som redan har börjat.
/*eventList.forEachr(card => {
    const startTime = Date.parse(card.dataset.start);

    if (!Number.isFinite(startTime) || startTime <= now) {
        card.remove();
    }
});*/
//const searchFeedback = document.querySelector("#search-feedback");
//const searchFeedbackField = document.querySelector(".search-feedback-field");
const apiStatus = document.getElementById("apiStatus");
const apiStatusfilter = document.getElementById("api-status");
const apiSearch = document.querySelector("#api-event-search");
const loadBTN = document.getElementById("loadBTN");
const apiURL = "http://localhost:5043/api/events";
const apiEventList = document.getElementById("apiEventLoader");
const apifilter = document.getElementById("api-load-filter");
//const articles = document.querySelectorAll("main article");


//En tom array[] som sedan hämtar data/lista för att fylla den.
let apifilterEvent = [];
//visar om en hämtning har lyckas.
let apiLoaded = false;

loadExampleEvents();


function showFilterCategory() {
    const selectedCategory = apifilter.value;
    const searchText = apiSearch.value.trim().toLowerCase();
    const matches = apifilterEvent.filter(event => {
        const matchesFilter = selectedCategory === "" || event.category === selectedCategory;
        const matchesSearch = event.title.toLowerCase().startsWith(searchText);
        return matchesFilter && matchesSearch;
    });
    //Tar bort gamla listor så dom inte dubbleras.
    apiEventList.replaceChildren();

    for (const event of matches) {
        const eventCard = document.createElement("article");
            eventCard.className = `eventlist`;
            eventCard.id = `${event.id}`;
            

            const title = document.createElement("h3");
            title.textContent = `${event.title}`;

            
            

            const category = document.createElement("p");
            category.textContent = `${event.category}`;
            
        
            

            eventCard.append(title, category);
            eventCard.addEventListener("click", () => openDialog(event));
            apiEventLoader.append(eventCard);
    }

    if (matches.length === 0) {
        apiStatus.textContent = "Inga evenemang stämmer med dina val";
    }else {
        apiStatus.textContent = `${matches.length} Evenemang visas.`;
    }
}

async function loadExampleEvents() {
    apiLoaded = false;
    apifilterEvent = [];
    apiStatus.textContent = "Hämtar event...";
    apifilter.replaceChildren(new Option("Alla event", ""));
    loadBTN.disabled = true;

    let userMessage = "eventen kunde inte hämtas";

    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            if (response.status === 404) {
                userMessage = "Eventen kunde inte hittas";
            }else if (response.status >= 500 && response.status <= 599) {
                userMessage = "Tjänsten har problem.försök igen senare";
            }
            throw new Error(`HTTP-fel: ${response.status}`);
        }

        const events = await response.json();
        apifilterEvent = events;
        apiLoaded = true;
        //new Set sparar bara unika värden, [..] gör om Set:en till en vanlig array.
        const categories = [...new Set(apifilterEvent.map(event => event.category))];

        for (const category of categories) {
            apifilter.append(new Option(category, category));
        }

        if (apifilterEvent.length === 0) {
            apiStatus.textContent = "Det finns inga event att visa.";
            return;
        }
        
        
        for (const event of events) {
            const eventCard = document.createElement("article");
            eventCard.className = `eventlist`;
            eventCard.id = `${event.id}`;
            

            const title = document.createElement("h3");
            title.textContent = `${event.title}`;

            
            

            const category = document.createElement("p");
            category.textContent = `${event.category}`;
            
        
            

            eventCard.append(title, category);
            eventCard.addEventListener("click", () => openDialog(event));
            apiEventLoader.append(eventCard);

        }
        



        showFilterCategory();
    } catch (error) {
        console.error("Kunde inte hämta event.se network för mer information.");
        apiStatus.textContent = userMessage;
    }finally {
        loadBTN.disabled = false;
    }
}

document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

function openDialog(ev) {
    content.replaceChildren();
    const startsAt = new Date(ev.startsAt);
    const eventTime = startsAt.toLocaleTimeString("sv-SE", {hour:"2-digit", minute:"2-digit"});
    const eventdate = startsAt.toLocaleDateString("sv-SE");
    const title = document.createElement("h3");
    title.textContent = `${ev.title}`;
    const description = document.createElement("p");
    description.textContent = `${ev.description}`;
    const venue = document.createElement("p");
    venue.textContent = `${ev.venue}`;
    const organizer = document.createElement("p");
    organizer.textContent = `${ev.organizer}`;
    const time = document.createElement("p");
    time.textContent = `${eventTime}`;
    const date = document.createElement("p");
    date.textContent = `${eventdate}`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent ="Anmälan";
    btn.addEventListener("click", () => {
        dialog.close();
        selectEvent.value = ev.id;
        bookingForm.scrollIntoView({ behavior: "smooth", block: "start"});
    });

    content.append(title, venue, organizer, time, date, description);
    content.appendChild(btn);

    dialog.showModal();   
}

loadBTN.addEventListener("click", loadExampleEvents);

apifilter.addEventListener("change", () => {
    if (apiLoaded) showFilterCategory();
});
/* filtrerar på id på hårdkodade artiklarna i HTML.
apifilter.addEventListener("change", function () {
            articles.forEach(function (a) {
            a.hidden = val.value !== "event" && a.id !== val.value;
            });
        });
*/
apiSearch.addEventListener("input", () => {
    if (apiLoaded) showFilterCategory();
});

/*
async function loadExempelEvents(){
    apiLoaded = false;
    apifilterEvent = [];
    apiStatus.textContent = "Hämntar events...";

    apiEventList.replaceChildren();
    
    loadBTN.disabled = true;

    let userMessage = "Evenemang kunde inte hämntas. Försök igen.";

    try{
        const response = await fetch(apiURL);

        if(!response.ok){
            if(response.status === 404){
                userMessage = "Evenemang kunde inte hittas.";
            }else if(response.status >= 500 && response.status <= 599){
                userMessage = "Tjänsten har problem. Försök igen senare";
            }
            throw new Error(`Http-fel: ${response.status}`);
        }

        const events = await response.json();
        apifilterEvent = events;

        apiLoaded = true;
        
        if(events.length === 0){
            apiStatus.textContent = "Det finns inga events att visa";
            return;
        }



        console.log(events);
        for (const event of events) {
            const eventCard = document.createElement("article");
            eventCard.className = `eventlist`;
            eventCard.id = `${event.id}`;
            const startsAt = new Date(event.startsAt);
            const eventTime = startsAt.toLocaleTimeString("sv-SE", {hour:"2-digit", minute:"2-digit"});
            const eventdate = startsAt.toLocaleDateString("sv-SE");

            const title = document.createElement("h3");
            title.textContent = `${event.title}`;
            const venue = document.createElement("p");
            venue.textContent = `${event.venue}`;
            const organizer = document.createElement("p");
            organizer.textContent = `${event.organizer}`;
            const time = document.createElement("p");
            time.textContent = `${eventTime}`;
            const date = document.createElement("p");
            date.textContent = `${eventdate}`;
            const category = document.createElement("p");
            category.textContent = `${event.category}`;
            const description = document.createElement("p");
            description.textContent = `${event.description}`;
        
            

            eventCard.append(title, venue, organizer, time, date, category, description);
            apiEventList.append(eventCard);

        }

        apiStatus.textContent = `${events.length} events hämntades`;

    }catch(error){
        console.error("Kunde inte hämnta exempelevents. Se network för mer information");
        apiStatus.textContent = userMessage;
    }finally{
        loadBTN.disabled = false;
    }
}
loadBTN.addEventListener("click", loadExempelEvents);

apifilter.addEventListener("change", () => {
    if (apiLoaded) showFilterCategory();
});

apiSearch.addEventListener("input", () => {
    if (apiLoaded) showFilterCategory();
});




/*searchForm.addEventListener("input", event => {
    event.preventDefault();

    let eventMatch = false;

    const searchValue = searchBar.value.toLowerCase().trim();
    

    eventList.forEach(card => {
        const eventTitle =  card.querySelector("h3").textContent.toLowerCase();
        if (eventTitle.startsWith(searchValue)){
        card.style.display = "";
        searchFeedbackField.classList.remove("error");
        searchFeedback.textContent = "";
        eventMatch = true;
    } 
    else {
        card.style.display = "none";
    }
    
    if (eventMatch) {
    searchFeedbackField.classList.remove("error");
    searchFeedback.textContent = "";
    } else {
        searchFeedbackField.classList.add("error");
        searchFeedback.textContent = "Inga evenemang matchar din sökning.";
    }

    });

});*/


const bookingForm = document.querySelector("#booking form");
const feedback = document.getElementById("feedback");
const selectEvent = document.querySelector("#selectEvent");

//if (!bookingForm || !feedback) {
//    return;
//}

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");


const eventData = [
    {id: "code-night", max: 50, booked: 50 }, 
    {id: "game-night", max: 50, booked: 27 },
    {id: "movie-night", max: 100, booked: 48 }
];

function updateEventAvailability() {
    Array.from(selectEvent.options).forEach(option =>  {
        const val = option.value
        const eventItem = eventData.find(e => e.id === val);

        if (eventItem) {
            const remaining = eventItem.max - eventItem.booked;
            let cleantext = option.text.split(" (")[0];

            if (remaining <= 0) {
                option.text = `${cleantext} - FULLBOKAT`;
                option.disabled = true;
            } else {
                option.text = `${cleantext} (${remaining} platser kvar)`;
            }
        }
    });
}

//if (!nameInput || !emailInput || !selectEvent) {
//    return;
//}



updateEventAvailability();
// Mahmoud: Stänger av inbyggda meddelanden för att visa egna, specifika fel i sidans återkoppling.
    if (bookingForm && feedback){
        bookingForm.noValidate = true;
    }
        

// Mahmoud: Samlar felhanteringen i en funktion. aria-invalid markerar felet, aria-describedby kopplar meddelandet och focus hjälper användaren att rätta.
function showFieldError(field, message) {
    feedback.textContent = message;
    feedback.classList.add("error");
    feedback.classList.remove("success");

    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", "feedback");
    field.focus();
}

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const eventValue = selectEvent.value;

    // Mahmoud: Rensar tidigare fel före ny validering så att rättade fält inte behåller felmarkeringen.
    for (const field of [nameInput, emailInput, selectEvent]) {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
    }

    feedback.textContent = "";
    feedback.classList.remove("error", "success");

    // Mahmoud: Ersätter den gemensamma tomfältskontrollen med separata kontroller och meddelanden. return stoppar flödet vid fel.
    if (name === "") {
        showFieldError(nameInput, "Ange ditt namn.");
        return;
    }

    if (email === "") {
        showFieldError(emailInput, "Ange din e-postadress.");
        return;
    }

    // Mahmoud: Använder e-postfältets validity efter trimning i stället för enkel kontroll av @ och punkt. Detta kontrollerar format, inte att adressen finns.
    emailInput.value = email;

    if (!emailInput.validity.valid) {
        showFieldError(
            emailInput,
            "Ange en giltig e-postadress, till exempel namn@example.se."
        );
        return;
    }

    // Mahmoud: Visar ett eget fel för saknat evenemang och flyttar fokus till rullistan.
    if (eventValue === "") {
        showFieldError(selectEvent, "Välj ett evenemang.");
        return;
    }
    // --- NY KONTROLL: Kolla om evenemanget är fullbokat ---
            const selectedEventData = eventData.find(e => e.id === eventValue);
            if (selectedEventData && selectedEventData.booked >= selectedEventData.max) {
                showFieldError(selectEvent, "FULLBOKAT: Det går inte att anmäla sig till detta evenemang.");
                return;
    }

    const eventName =
        selectEvent.options[selectEvent.selectedIndex].text;

    // Mahmoud: Förtydligar att bekräftelsen inte innebär en sparad anmälan. textContent visar inmatning som text.
    // Visar användarens uppgifter som text, inte HTML.
    feedback.textContent =
        `Tack ${name}! Du har valt ${eventName}. ` +
        "Ingen anmälan har skickats eller sparats.";

    feedback.classList.add("success");
    bookingForm.reset();
    updateEventAvailability();
});
//});

