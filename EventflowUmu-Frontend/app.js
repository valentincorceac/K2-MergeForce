const bookingForm = document.querySelector("#booking form");
const feedback  = document.getElementById("feedback");
const list      = document.querySelector(".event-list");
const dialog    = document.querySelector("#eventDialog");
const content   = document.querySelector("#dialogContent");
const selectEvent = document.getElementById("selectEvent");


//Event Data as objects
const DEMO_EVENTS = [
    {
        id:         1, 
        title:      "Coding Night", 
        image:      "picturesadd/event1.jpg",
        date:       "2026-06-15", 
        time:       "18:00–22:00",
        location:   "Tech Hub, Main Street", 
        category:   "Teknik",
        organizer:  "Code Club AB",
        description: "Join us for an exciting night of coding, collaboration, and learning. Bring your laptop and your ideas!" 
    },
    {
        id:         2, 
        title:      "Game night", 
        image:      "picturesadd/event2.jpg",
        date:       "2026-06-15", 
        time:       "18:00–22:00",
        location:   "Tech Hub, Main Street", 
        category:   "Teknik",
        organizer:  "Code Club AB",
        description: "Spela hela natten!"
    },
    {
        id:         3, 
        title:      "Movie Night", 
        image:      "picturesadd/event3.jpg",
        date:       "2026-06-15", 
        time:       "18:00–22:00",
        location:   "Tech Hub, Main Street", 
        category:   "Teknik",
        organizer:  "Code Club AB",
        description: "Se film hela kvällen!"
    }
];

if(getEvents().length === 0){
    saveEvents(DEMO_EVENTS);
}

const events = getEvents();

function getEvents() {
    const raw = localStorage.getItem("events");   // returns a string, or null
    return raw ? JSON.parse(raw) : [];            // parse it, or empty array if nothing saved
}

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

buildEventSelect();

//Loops through each Array object and build an article card for the HTML
events.forEach(ev => {
    const card = document.createElement("article");
    card.className = "eventlist";
    card.innerHTML = `<h3>${ev.title}</h3>
                        
                        <img src="${ev.image}" alt="${ev.title}">`;
    card.addEventListener("click", () => openDialog(ev)); //Add an event listener for the whole article
    list.appendChild(card);
});

document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

//Builds the event view with Dialog tag inside the HTML with the event object data.
function openDialog(ev) {
    content.innerHTML = `
        <h2>${ev.title}</h2>
        <dl class="event-details">
            <dt>Datum</dt><dd>${ev.date}</dd>
            <dt>Tid</dt><dd>${ev.time}</dd>
            <dt>Plats</dt><dd>${ev.location}</dd>
            <dt>Kategori</dt><dd>${ev.category}</dd>
            <dt>Arrangör</dt><dd>${ev.organizer}</dd>
        </dl>
        <p>${ev.description}</p>
        <button type="button" class="btn">Anmälan</button>`; //A button to close the event over view
    dialog.showModal();   
}

function buildEventSelect() {
    events.forEach(ev => {
        const option = document.createElement("option");
        option.value = ev.id;
        option.textContent = ev.title;
        selectEvent.appendChild(option);
    });
}


if (bookingForm && feedback) {
    bookingForm.addEventListener("submit", (event) => {
        // Förhindrar att sidan laddas om
        event.preventDefault(); 

        // Hämta fält och hantera blanksteg med .trim()
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const phoneInput = document.getElementById("phone");
        

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const sessionValue = selectEvent.value;

        // Hämta det snygga namnet på evenemanget från rullistan
        const session = selectEvent.selectedIndex > 1 ? selectEvent.options[selectEvent.selectedIndex].text : "";

        // 1. Kontrollera obligatoriska värden
        if (name === "" && email === "" && sessionValue === "") {
            feedback.textContent = "Vänligen fyll i alla obligatoriska fält och välj ett evenemang.";
            feedback.classList.add("error");
            feedback.classList.remove("success");
            return;
        }

        // 2. Enkel kontroll av e-postformat
        if (!email.includes("@") || !email.includes(".")) {
            feedback.textContent = "Vänligen ange en giltig e-postadress.";
            feedback.classList.add("error");
            feedback.classList.remove("success");
            return;
        }
        // 3. Bekräftelse vid giltig inmatning (ersätter tidigare felmeddelanden)
        feedback.textContent = `Tack ${name}. du har valt ${session}. E-postadress: ${email}.`;
        feedback.classList.add("success");
        feedback.classList.remove("error");

        // Nollställ formuläret efter lyckad anmälan
        bookingForm.reset();
    });
}
