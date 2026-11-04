document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.querySelector("#booking form");
    const feedback = document.getElementById("feedback");

    if (bookingForm && feedback) {
        bookingForm.addEventListener("submit", (event) => {
            // Förhindrar att sidan laddas om
            event.preventDefault(); 

            // Hämta fält och hantera blanksteg med .trim()
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const selectEvent = document.getElementById("selectEvent");

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const sessionValue = selectEvent.value;

            // Hämta det snygga namnet på evenemanget från rullistan
            const session = selectEvent.selectedIndex > 0 ? selectEvent.options[selectEvent.selectedIndex].text : "";

            // 1. Kontrollera obligatoriska värden
            if (name === ""  email === ""  sessionValue === "") {
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
});
