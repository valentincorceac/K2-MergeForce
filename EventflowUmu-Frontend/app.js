document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.querySelector("#booking form");
    const feedback = document.getElementById("feedback");

    if (!bookingForm || !feedback) {
        return;
    }

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const selectEvent = document.getElementById("selectEvent");

    if (!nameInput || !emailInput || !selectEvent) {
        return;
    }

    // Mahmoud: Stänger av inbyggda meddelanden för att visa egna, specifika fel i sidans återkoppling.
    // TILLÄGG: JavaScript visar egna, tydliga felmeddelanden.
    bookingForm.noValidate = true;

    // Mahmoud: Samlar felhanteringen i en funktion. aria-invalid markerar felet, aria-describedby kopplar meddelandet och focus hjälper användaren att rätta.
    // TILLÄGG: Visar vilket fält som är fel och flyttar fokus dit.
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
        // TILLÄGG: Tar bort tidigare felmarkeringar inför en ny kontroll.
        for (const field of [nameInput, emailInput, selectEvent]) {
            field.removeAttribute("aria-invalid");
            field.removeAttribute("aria-describedby");
        }

        feedback.textContent = "";
        feedback.classList.remove("error", "success");

        // Mahmoud: Ersätter den gemensamma tomfältskontrollen med separata kontroller och meddelanden. return stoppar flödet vid fel.
        // ÄNDRING: Varje fält får ett eget felmeddelande.
        if (name === "") {
            showFieldError(nameInput, "Ange ditt namn.");
            return;
        }

        if (email === "") {
            showFieldError(emailInput, "Ange din e-postadress.");
            return;
        }

        // Mahmoud: Använder e-postfältets validity efter trimning i stället för enkel kontroll av @ och punkt. Detta kontrollerar format, inte att adressen finns.
        // ÄNDRING: Kontrollerar e-post med webbläsarens formatkontroll.
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

        const eventName =
            selectEvent.options[selectEvent.selectedIndex].text;

        // Mahmoud: Förtydligar att bekräftelsen inte innebär en sparad anmälan. textContent visar inmatning som text.
        // Visar användarens uppgifter som text, inte HTML.
        feedback.textContent =
            `Tack ${name}! Du har valt ${eventName}. ` +
            "Ingen anmälan har skickats eller sparats.";

        feedback.classList.add("success");
        bookingForm.reset();
    });
});

// Mahmoud: Tillägg för lokalt skapade evenemang. Hämtar behållaren och rullistan så att samma evenemang visas på båda ställena.
// Hämtar listan med kort och bokningsformulärets rullista.
const eventList = document.querySelector(".event-list");
const bookingSelect = document.querySelector("#selectEvent");

try {
    // Mahmoud: Läser JSON från samma localStorage-nyckel som arrangörssidan. Detta är lokal lagring, inte SQL eller API.
    // Läser evenemang som arrangören har sparat lokalt.
    const savedText = localStorage.getItem("eventflow-events");
    const savedEvents = savedText ? JSON.parse(savedText) : [];

    // Mahmoud: Kontrollerar att lagrad data är en lista innan den används.
    if (!Array.isArray(savedEvents)) {
        throw new Error("Ogiltigt format på sparade evenemang.");
    }

    for (const item of savedEvents) {
        // Mahmoud: Kontrollerar obligatoriska egenskapers typer och hoppar över felaktiga poster.
        // Hoppar över poster som saknar rätt uppgifter.
        if (
            !item ||
            typeof item.id !== "string" ||
            typeof item.title !== "string" ||
            typeof item.date !== "string" ||
            typeof item.place !== "string" ||
            typeof item.category !== "string"
        ) {
            continue;
        }

        // Mahmoud: Bygger nya kort med createElement utan att ändra teamets statiska kort. textContent används för sparad text.
        // Skapar ett nytt evenemangskort.
        const card = document.createElement("article");
        card.className = "eventlist";

        const heading = document.createElement("h3");
        heading.textContent = item.title;

        // Mahmoud: Skapar img för sparad bilddata. Kontrollen begränsar adressformatet; den ersätter inte servervalidering av uppladdningar.
        // Visar bilden om evenemanget har en sparad bild.
        if (
        typeof item.image === "string" &&
        /^data:image\/(jpeg|png|webp);base64,/.test(item.image)
        ) {
        const image = document.createElement("img");

        image.src = item.image;
         image.alt = `Bild för ${item.title}`;
         image.loading = "lazy";

         card.append(image);
         }

        const dateText = document.createElement("p");
        dateText.textContent = `Datum: ${item.date}`;

        const placeText = document.createElement("p");
        placeText.textContent = `Plats: ${item.place}`;

        const categoryText = document.createElement("p");
        categoryText.textContent = `Kategori: ${item.category}`;

        // Mahmoud: Lägger det lokala evenemanget i anmälningslistan med samma id som kortet.
        // Gör evenemanget valbart i anmälningsformuläret.
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.title;
        bookingSelect.append(option);

        const bookingLink = document.createElement("a");
        bookingLink.href = "#booking";
        bookingLink.textContent = "Anmälan";

        // Mahmoud: Väljer rätt evenemang när besökaren följer kortets anmälningslänk.
        bookingLink.addEventListener("click", () => {
            bookingSelect.value = item.id;
        });

        // Mahmoud: Lägger ihop kortets innehåll och uppdaterar DOM utan att skapa HTML från användartext.
        // Lägger kortet i listan på startsidan.
        card.append(
            heading,
            dateText,
            placeText,
            categoryText,
            bookingLink
        );

        eventList.append(card);
    }
} catch (error) {
    // Mahmoud: Fångar läsfel och skriver dem i Console utan att radera lokala data.
    // Befintliga evenemang fungerar även om lokal data inte kan läsas.
    console.error("Kunde inte läsa lokala evenemang:", error);
}
