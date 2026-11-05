"use strict";

// Mahmoud: Hämtar formuläret och dess fält.
// Hämtar formuläret och dess fält.
const createForm = document.querySelector("#create-event-form");
const titleInput = document.querySelector("#event-title");
const dateInput = document.querySelector("#event-date");
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
// null betyder att vi skapar ett nytt evenemang.
let editingId = null;

// Mahmoud: Används bara för förhandsvisning av en ny bild.
// Används bara för förhandsvisning av en ny bild.
let previewUrl = null;

// Mahmoud: Hindrar flera sparningar medan en bild läses.
// Hindrar flera sparningar medan en bild läses.
let isSaving = false;

// Mahmoud: Skapar en knapp för att avbryta redigering.
// Skapar en knapp för att avbryta redigering.
const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Avbryt redigering";
cancelButton.className = "btn";
cancelButton.hidden = true;

submitButton.after(cancelButton);

// Mahmoud: Visar antingen fel eller bekräftelse.
// Visar antingen fel eller bekräftelse.
function showMessage(message, isError) {
    feedback.textContent = message;
    feedback.classList.toggle("error", isError);
    feedback.classList.toggle("success", !isError);
}

// Mahmoud: Läser sparade evenemang utan att ändra dem.
// Läser sparade evenemang utan att ändra dem.
// Mahmoud: JSON.parse återskapar listan. Felaktigt format kastar ett fel så att befintlig data inte skrivs över som en tom lista.
function readEvents() {
    const savedText = localStorage.getItem("eventflow-events");
    const events = savedText ? JSON.parse(savedText) : [];

    if (!Array.isArray(events)) {
        throw new Error("Sparade evenemang har fel format.");
    }

    return events;
}

// Mahmoud: Sparar hela den uppdaterade listan.
// Sparar hela den uppdaterade listan.
// Mahmoud: JSON.stringify gör listan till text för localStorage. Ändringen gäller endast denna webbläsare och origin.
function saveEvents(events) {
    localStorage.setItem(
        "eventflow-events",
        JSON.stringify(events)
    );
}

// Mahmoud: Kontrollerar att bildadressen har ett tillåtet format.
// Kontrollerar att bildadressen har ett tillåtet format.
function isImage(value) {
    return (
        typeof value === "string" &&
        /^data:image\/(jpeg|png|webp);base64,/.test(value)
    );
}

// Mahmoud: Tar bort den tillfälliga bildadressen.
// Tar bort den tillfälliga bildadressen.
function clearPreview() {
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
    }

    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
}

// Mahmoud: Visar eller döljer fältet för en egen kategori.
// Visar eller döljer fältet för en egen kategori.
function updateCategoryField() {
    const isOther = categoryInput.value === "other";

    customCategoryGroup.hidden = !isOther;
    customCategoryInput.disabled = !isOther;
    customCategoryInput.required = isOther;
}

categoryInput.addEventListener("change", () => {
    updateCategoryField();

    if (categoryInput.value === "other") {
        customCategoryInput.focus();
    } else {
        customCategoryInput.value = "";
    }
});

// Mahmoud: Kontrollerar och förhandsvisar en ny bild.
// Kontrollerar och förhandsvisar en ny bild.
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

    if (!imageInput.reportValidity()) {
        return;
    }

    previewUrl = URL.createObjectURL(file);
    imagePreview.src = previewUrl;
    imagePreview.hidden = false;
});

// Mahmoud: Läser bildens innehåll inför lokal lagring.
// Läser bildens innehåll inför lokal lagring.
// Mahmoud: Promise väntar på FileReader. Bilden blir en data-URL; stor lokal bilddata kan överskrida lagringsutrymmet.
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
// Återställer formuläret till läget för ett nytt evenemang.
function resetEditor() {
    createForm.reset();
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

// Mahmoud: Fyller formuläret med ett sparat evenemang.
// Fyller formuläret med ett sparat evenemang.
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
        placeInput.value = item.place;

        // Mahmoud: Använder "Annat" om kategorin saknas i rullistan.
        // Använder "Annat" om kategorin saknas i rullistan.
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
        // Behåller den gamla bilden om ingen ny väljs.
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
// Tar bort endast det valda evenemanget efter bekräftelse.
// Mahmoud: confirm kräver bekräftelse. filter utesluter endast det valda id:t; lagringen uppdateras före gränssnittet.
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

        // Mahmoud: Ändrar gränssnittet först efter lyckad lagring.
        // Ändrar gränssnittet först efter lyckad lagring.
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

// Mahmoud: Visar sparade evenemang i arrangörsvyn.
// Visar sparade evenemang i arrangörsvyn.
// Mahmoud: Återskapar hanteringslistan och kopplar Redigera och Ta bort till varje evenemangs id.
function renderEvents() {
    try {
        const events = readEvents();
        managedEvents.replaceChildren();

        if (events.length === 0) {
            const message = document.createElement("p");
            message.textContent = "Det finns inga lokalt sparade evenemang.";
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

            card.append(date, place, category, actions);
            managedEvents.append(card);
        }
    } catch (error) {
        showMessage(
            "Listan kunde inte läsas. Sparade uppgifter har inte raderats.",
            true
        );
    }
}

// Mahmoud: Skapar ett nytt evenemang eller sparar en redigering.
// Skapar ett nytt evenemang eller sparar en redigering.
// Mahmoud: async/await väntar på bilden. Samma submitflöde skapar en post eller ändrar befintlig post beroende på editingId.
createForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSaving) {
        return;
    }

    const title = titleInput.value.trim();
    const date = dateInput.value;
    const place = placeInput.value.trim();

    const category = categoryInput.value === "other"
        ? customCategoryInput.value.trim()
        : categoryInput.value;

    if (!title || !date || !place || !category) {
        showMessage(
            "Fyll i titel, datum, plats och välj eller ange en kategori.",
            true
        );
        return;
    }

    if (!createForm.reportValidity()) {
        return;
    }

    isSaving = true;
    submitButton.disabled = true;
    cancelButton.disabled = true;

    try {
        // Mahmoud: Minns vilken post som ska uppdateras.
        // Minns vilken post som ska uppdateras.
        const idToEdit = editingId;
        const file = imageInput.files[0];

        let imageData = null;

        if (file) {
            imageData = await readImage(file);
        }

        // Mahmoud: Läser listan efter bildläsningen för att få aktuella uppgifter.
        // Läser listan efter bildläsningen för att få aktuella uppgifter.
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
        item.place = place;
        item.category = category;

        // Mahmoud: Byter bild endast om användaren har valt en ny.
        // Byter bild endast om användaren har valt en ny.
        if (file) {
            item.image = imageData;
        }

        saveEvents(events);

        resetEditor();
        renderEvents();

        showMessage(
            idToEdit === null
                ? `${title} har sparats lokalt.`
                : `Ändringarna för ${title} har sparats.`,
            false
        );
    } catch (error) {
        showMessage(
            "Kunde inte spara. Bilden kan vara för stor eller " +
            "lagringsutrymmet fullt. Dina uppgifter finns kvar.",
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
// Förbereder sidan när skriptet laddas.
updateCategoryField();
renderEvents();