"use strict";

// Mahmoud: Hämtar formuläret och dess fält.
const createForm = document.querySelector("#create-event-form");
const titleInput = document.querySelector("#event-title");
const dateInput = document.querySelector("#event-date");
// Mahmoud: Läser nya tidsfält och beskrivning för både skapande och redigering.
const startTimeInput = document.querySelector("#event-start-time");
const endTimeInput = document.querySelector("#event-end-time");
const descriptionInput = document.querySelector("#event-description");
const placeInput = document.querySelector("#event-place");
const categoryInput = document.querySelector("#event-category");
const customCategoryGroup = document.querySelector("#custom-category-group");
const customCategoryInput = document.querySelector("#custom-category");
const imageInput = document.querySelector("#event-image");
const imagePreview = document.querySelector("#image-preview");
const feedback = document.querySelector("#create-event-feedback");
const managedEvents = document.querySelector("#managed-events");
const submitButton = createForm.querySelector('button[type="submit"]');

// Mahmoud: null betyder att vi skapar ett nytt evenemang.
let editingId = null;

// Mahmoud: Används bara för förhandsvisning av en ny bild.
let previewUrl = null;

// Mahmoud: Hindrar flera sparningar medan en bild läses.
let isSaving = false;

// Mahmoud: Skapar en knapp för att avbryta redigering.
const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Avbryt redigering";
cancelButton.className = "btn";
cancelButton.hidden = true;

submitButton.after(cancelButton);

// Mahmoud: Visar antingen fel eller bekräftelse.
function showMessage(message, isError) {
    feedback.textContent = message;
    feedback.classList.toggle("error", isError);
    feedback.classList.toggle("success", !isError);
}

// Mahmoud: Markerar det felaktiga fältet och visar ett meddelande på sidan.
function showFieldError(field, message) {
    showMessage(message, true);
    field.setAttribute("aria-invalid", "true");
    field.focus();
}

// Mahmoud: Listan finns bara medan sidan är öppen.
let currentEvents = [];

function readEvents() {
    return currentEvents;
}

// Mahmoud: Uppdaterar listan på sidan utan att skriva till någon lagring.
function saveEvents(events) {
    currentEvents = events;
}

// Mahmoud: Kontrollerar att bildadressen har ett tillåtet format.
function isImage(value) {
    return (
        typeof value === "string" &&
        /^data:image\/(jpeg|png|webp);base64,/.test(value)
    );
}

// Mahmoud: Tar bort den tillfälliga bildadressen.
function clearPreview() {
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
    }

    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
}

// Mahmoud: Visar eller döljer fältet för en egen kategori.
function updateCategoryField() {
    const isOther = categoryInput.value === "other";

    customCategoryGroup.hidden = !isOther;
    customCategoryInput.disabled = !isOther;
    customCategoryInput.required = isOther;
}

// Mahmoud: Tar bort tidigare tidsfel när sluttiden ändras.
endTimeInput.addEventListener("input", () => endTimeInput.setCustomValidity(""));
startTimeInput.addEventListener("input", () => endTimeInput.setCustomValidity(""));

categoryInput.addEventListener("change", () => {
    updateCategoryField();

    if (categoryInput.value === "other") {
        customCategoryInput.focus();
    } else {
        customCategoryInput.value = "";
    }
});

// Mahmoud: Kontrollerar och förhandsvisar en ny bild.
imageInput.addEventListener("change", () => {
    clearPreview();
    imageInput.setCustomValidity("");

    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        imageInput.setCustomValidity(
            "Välj en bild i JPG-, PNG- eller WebP-format."
        );
    } else if (file.size > 5 * 1024 * 1024) {
        imageInput.setCustomValidity(
            "Bilden får vara högst 5 MB."
        );
    }

    if (!imageInput.validity.valid) {
        showFieldError(imageInput, imageInput.validationMessage);
        return;
    }
    imageInput.removeAttribute("aria-invalid");

    previewUrl = URL.createObjectURL(file);
    imagePreview.src = previewUrl;
    imagePreview.hidden = false;
});

// Mahmoud: Läser bildens innehåll för att visa bilden på sidan.
// Mahmoud: Promise väntar på FileReader. Bilden blir en data-URL som kan visas i ett img-element.
function readImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            resolve(reader.result);
        });

        reader.addEventListener("error", () => {
            reject(new Error("Bilden kunde inte läsas."));
        });

        reader.readAsDataURL(file);
    });
}

// Mahmoud: Återställer formuläret till läget för ett nytt evenemang.
function resetEditor() {
    createForm.reset();
    // Mahmoud: Rensar tidigare tidsvalidering när formuläret återställs.
    endTimeInput.setCustomValidity("");
    editingId = null;

    clearPreview();
    imageInput.setCustomValidity("");
    imageInput.required = true;

    customCategoryInput.value = "";
    updateCategoryField();

    submitButton.textContent = "Publicera evenemang";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", () => {
    resetEditor();
    feedback.textContent = "";
    feedback.classList.remove("error", "success");
});

// Mahmoud: Fyller formuläret med ett evenemang på sidan.
// Mahmoud: find väljer rätt id. Formuläret återanvänds, egen kategori fylls i och befintlig bild behålls om ingen ny väljs.
function editEvent(id) {
    try {
        const item = readEvents().find(event => event.id === id);

        if (!item) {
            throw new Error("Evenemanget hittades inte.");
        }

        resetEditor();
        editingId = item.id;

        titleInput.value = item.title;
        dateInput.value = item.date;
        // Mahmoud: Äldre evenemang på sidan saknar tid; tomma värden kan fyllas i vid redigering.
        startTimeInput.value = item.startTime || "";
        endTimeInput.value = item.endTime || "";
        descriptionInput.value = item.description || "";
        placeInput.value = item.place;

        // Mahmoud: Använder "Annat" om kategorin saknas i rullistan.
        categoryInput.value = item.category;

        if (
            categoryInput.value === "" ||
            categoryInput.value === "other"
        ) {
            categoryInput.value = "other";
            customCategoryInput.value = item.category;
        }

        updateCategoryField();

        // Mahmoud: Behåller den gamla bilden om ingen ny väljs.
        imageInput.required = !isImage(item.image);

        if (isImage(item.image)) {
            imagePreview.src = item.image;
            imagePreview.hidden = false;
        }

        submitButton.textContent = "Spara ändringar";
        cancelButton.hidden = false;

        showMessage(
            "Redigera uppgifterna. Välj en ny bild bara om du vill byta.",
            false
        );

        createForm.scrollIntoView({ block: "start" });
        titleInput.focus({ preventScroll: true });
    } catch (error) {
        showMessage("Evenemanget kunde inte öppnas.", true);
    }
}

// Mahmoud: Tar bort endast det valda evenemanget efter bekräftelse.
// Mahmoud: confirm kräver bekräftelse. filter utesluter endast det valda id:t; listan uppdateras före gränssnittet.
function deleteEvent(id) {
    try {
        const events = readEvents();
        const item = events.find(event => event.id === id);

        if (!item) {
            throw new Error("Evenemanget hittades inte.");
        }

        const confirmed = window.confirm(
            `Vill du ta bort "${item.title}"?`
        );

        if (!confirmed) {
            return;
        }

        const remainingEvents = events.filter(event => event.id !== id);

        // Mahmoud: Ändrar gränssnittet först efter att listan har uppdaterats.
        saveEvents(remainingEvents);

        if (editingId === id) {
            resetEditor();
        }

        renderEvents();
        showMessage(`${item.title} har tagits bort.`, false);
    } catch (error) {
        showMessage("Evenemanget kunde inte tas bort.", true);
    }
}

// Mahmoud: Visar evenemang på sidan i arrangörsvyn.
// Mahmoud: Återskapar hanteringslistan och kopplar Redigera och Ta bort till varje evenemangs id.
function renderEvents() {
    try {
        const events = readEvents();
        managedEvents.replaceChildren();

        if (events.length === 0) {
            const message = document.createElement("p");
            message.textContent = "Det finns inga evenemang ännu.";
            managedEvents.append(message);
            return;
        }

        for (const item of events) {
            const card = document.createElement("article");
            card.className = "eventlist";

            const heading = document.createElement("h3");
            heading.textContent = item.title;
            card.append(heading);

            if (isImage(item.image)) {
                const image = document.createElement("img");
                image.src = item.image;
                image.alt = `Bild för ${item.title}`;
                image.loading = "lazy";
                card.append(image);
            }

            const date = document.createElement("p");
            date.textContent = `Datum: ${item.date}`;

            // Mahmoud: Visar sparade tider även i arrangörens hanteringslista.
            const time = document.createElement("p");
            time.textContent = item.startTime && item.endTime
                ? `Tid: ${item.startTime} - ${item.endTime}`
                : "Tid: Ej angiven";

            const place = document.createElement("p");
            place.textContent = `Plats: ${item.place}`;

            const category = document.createElement("p");
            category.textContent = `Kategori: ${item.category}`;

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "btn";
            editButton.textContent = "Redigera";
            editButton.setAttribute(
                "aria-label",
                `Redigera ${item.title}`
            );

            editButton.addEventListener("click", () => {
                editEvent(item.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn";
            deleteButton.textContent = "Ta bort";
            deleteButton.setAttribute(
                "aria-label",
                `Ta bort ${item.title}`
            );

            deleteButton.addEventListener("click", () => {
                deleteEvent(item.id);
            });

            const actions = document.createElement("div");
            actions.className = "event-actions";
            actions.append(editButton, deleteButton);

            card.append(date, time, place, category, actions);
            managedEvents.append(card);
        }
    } catch (error) {
        showMessage(
            "Listan kunde inte visas. Försök igen.",
            true
        );
    }
}

// Mahmoud: Skapar ett nytt evenemang eller sparar en redigering.
// Mahmoud: async/await väntar på bilden. Samma submitflöde skapar en post eller ändrar befintlig post beroende på editingId.
createForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSaving) {
        return;
    }

    const title = titleInput.value.trim();
    const date = dateInput.value;
    // Mahmoud: Tider lagras som HH:MM och jämförs i samma kalenderdag.
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const description = descriptionInput.value.trim();
    const place = placeInput.value.trim();

    const category = categoryInput.value === "other"
        ? customCategoryInput.value.trim()
        : categoryInput.value;

    // Mahmoud: Tar bort tidigare fel innan uppgifterna kontrolleras igen.
    const fields = [titleInput, dateInput, startTimeInput, endTimeInput,
        descriptionInput, placeInput, categoryInput, customCategoryInput, imageInput];

    for (const field of fields) {
        field.removeAttribute("aria-invalid");
    }

    feedback.textContent = "";
    feedback.classList.remove("error", "success");

    // Mahmoud: Visar vilket fält som saknar uppgifter och flyttar fokus dit.
    if (!title) {
        showFieldError(titleInput, "Ange en titel.");
        return;
    }
    if (title.length > 27) {
        showFieldError(titleInput, "Titeln får vara högst 27 tecken.");
        return;
    }
    if (!date) {
        showFieldError(dateInput, "Välj ett datum.");
        return;
    }
    if (!startTime) {
        showFieldError(startTimeInput, "Ange en starttid.");
        return;
    }
    if (!endTime) {
        showFieldError(endTimeInput, "Ange en sluttid.");
        return;
    }
    if (description.length > 54) {
        showFieldError(descriptionInput, "Beskrivningen får vara högst 54 tecken.");
        return;
    }
    if (!place) {
        showFieldError(placeInput, "Ange en plats.");
        return;
    }
    if (!category) {
        const field = categoryInput.value === "other" ? customCategoryInput : categoryInput;
        showFieldError(field, "Välj eller ange en kategori.");
        return;
    }
    if (imageInput.required && !imageInput.files[0]) {
        showFieldError(imageInput, "Välj en bild för evenemanget.");
        return;
    }

    // Mahmoud: Stoppar en sluttid som inte ligger efter starttiden.
    endTimeInput.setCustomValidity("");
    if (startTime && endTime && endTime <= startTime) {
        endTimeInput.setCustomValidity("Sluttiden måste vara senare än starttiden.");
        showFieldError(endTimeInput, "Sluttiden måste vara senare än starttiden samma dag.");
        return;
    }

    for (const field of fields) {
        if (!field.disabled && !field.validity.valid) {
            showFieldError(field, field.validationMessage);
            return;
        }
    }

    // Mahmoud: Rensar tidsfelet när användaren försöker spara igen.
    isSaving = true;
    submitButton.disabled = true;
    cancelButton.disabled = true;

    try {
        // Mahmoud: Minns vilken post som ska uppdateras.
        const idToEdit = editingId;
        const file = imageInput.files[0];

        let imageData = null;

        if (file) {
            imageData = await readImage(file);
        }

        // Mahmoud: Läser listan efter bildläsningen för att få aktuella uppgifter.
        const events = readEvents();
        let item;

        if (idToEdit !== null) {
            item = events.find(event => event.id === idToEdit);

            if (!item) {
                throw new Error("Evenemanget finns inte längre.");
            }
        } else {
            item = {
                id: `event-${crypto.randomUUID()}`
            };

            events.push(item);
        }

        item.title = title;
        item.date = date;
        // Mahmoud: Sparar nya fält tillsammans med övriga evenemangsuppgifter.
        item.startTime = startTime;
        item.endTime = endTime;
        item.description = description;
        item.place = place;
        item.category = category;

        // Mahmoud: Byter bild endast om användaren har valt en ny.
        if (file) {
            item.image = imageData;
        }

        saveEvents(events);

        resetEditor();
        renderEvents();

        showMessage(
            idToEdit === null
                ? `${title} visas nu på den här sidan tills den laddas om.`
                : `${title} har uppdaterats på den här sidan.`,
            false
        );
    } catch (error) {
        showMessage(
            "Evenemanget kunde inte visas. Försök välja bilden igen. Dina uppgifter finns kvar.",
            true
        );
    // Mahmoud: Återaktiverar sparknapparna även om läsning eller sparande misslyckas.
    } finally {
        isSaving = false;
        submitButton.disabled = false;
        cancelButton.disabled = false;
    }
});

// Mahmoud: Förbereder sidan när skriptet laddas.
updateCategoryField();
renderEvents();
