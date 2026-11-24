//document.addEventListener("DOMContentLoaded", () => {

//search bar
const searchForm = document.querySelector("#search-form");
const searchBar = document.querySelector("#search-bar");
const eventList = document.querySelectorAll(".eventlist");
// Hämta aktuell tid från besökarens enhet.
const now = Date.now();

// Dölj evenemang som redan har börjat.
eventList.forEach(card => {
    const startTime = Date.parse(card.dataset.start);

    if (!Number.isFinite(startTime) || startTime <= now) {
        card.remove();
    }
});
const searchFeedback = document.querySelector("#search-feedback");
const searchFeedbackField = document.querySelector(".search-feedback-field");
const apiStatus = document.getElementById("apiStatus");
const loadBTN = document.getElementById("loadBTN");
const apiURL = "http://localhost:5043/api/events";
const apiEventList = document.getElementById("apiEventLoader");

loadBTN.addEventListener("click", loadExempelEvents);

async function loadExempelEvents(){
    apiStatus.textContent = "Hämtar evenemang...";

    apiEventList.replaceChildren();

    loadBTN.disabled = true;

    let userMessage = "Evenemang kunde inte hämtas. Försök igen.";

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
        
        if(events.length === 0){
            apiStatus.textContent = "Det finns inga evenemang att visa";
            return;
        }

        console.log(events);
        for (const event of events) {
            //filtrera evenemang här!
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

        apiStatus.textContent = `${events.length} evenemang hämtades`;

    }catch(error){
        console.error("Kunde inte hämnta exempelevents. Se network för mer information");
        apiStatus.textContent = userMessage;
    }finally{
        loadBTN.disabled = false;
    }
}





searchForm.addEventListener("input", event => {
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

});


const bookingForm = document.querySelector("#booking form");
const feedback = document.getElementById("feedback");
const selectEvent = document.querySelector("#selectEvent");

//if (!bookingForm || !feedback) {
//    return;
//}
// hämtar telefonnummer, namn och email. 
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

// maxtak på bokning
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
    //filtrear dina sökningar, hämtar elementid ifrån "val"
const val = document.getElementById("val");
const artiklar = document.querySelectorAll("main article");

if (val) {
val.addEventListener("change", function () {
artiklar.forEach(function (a) {
    a.hidden = val.value !== "event" && a.id !== val.value;
});
});
}

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
//lyssnar efter input i telefonfältet, användaren kan bara skriva siffror
phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
});

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const eventValue = selectEvent.value;

    // Mahmoud: Rensar tidigare fel före ny validering så att rättade fält inte behåller felmarkeringen.
    for (const field of [nameInput, emailInput,phoneInput, selectEvent]) {
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

    if (phone === "") {
        showFieldError(phoneInput, "Ange ditt telefonnummer.");
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

