//document.addEventListener("DOMContentLoaded", () => {

//search bar
const searchForm = document.querySelector("#search-form");
const searchBar = document.querySelector("#search-bar");
const eventList = document.querySelectorAll(".eventlist");
const searchFeedback = document.querySelector("#search-feedback");
const searchFeedbackField = document.querySelector(".search-feedback-field");




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

