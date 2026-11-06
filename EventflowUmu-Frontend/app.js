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
    bookingForm.noValidate = true;

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

