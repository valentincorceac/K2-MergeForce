const form = document.querySelector("#createEventForm");
const removeBtn = document.getElementById("removeBtn");


function getEvents() {
    const raw = localStorage.getItem("events");   // returns a string, or null
    return raw ? JSON.parse(raw) : [];            // parse it, or empty array if nothing saved
}

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}


form.addEventListener("submit", (event) =>{
    event.preventDefault();

    const data = new FormData(form);
    const newEvent = {
        id: Date.now(),                      // unique ID
        title:       data.get("title").trim(),       //Gets the value of the input with the "title" name
        image:       data.get("image") || "picturesadd/Placeholder.png",
        date:        data.get("date"),
        time:        data.get("time"),
        location:    data.get("venue"),
        category:    data.get("select-category"),
        organizer:   data.get("organizer"),
        description: data.get("description").trim()

    };

    const events = getEvents();
    events.push(newEvent);
    saveEvents(events);

    console.log(events);

    form.reset();
    document.getElementById("feedback").textContent = "Evenemang Skapat!";
});

removeBtn.addEventListener("click", () => {
    localStorage.clear();
});