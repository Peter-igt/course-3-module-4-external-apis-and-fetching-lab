const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("stateInput");
const searchBtn = document.getElementById("searchBtn");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

searchBtn.addEventListener("click", getWeatherAlerts);

function getWeatherAlerts() {
    const state = stateInput.value.trim().toUpperCase();

    // Clear previous results and errors
    alertsDisplay.innerHTML = "";
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    if (state === "") {
        errorMessage.textContent = "Please enter a state abbreviation.";
        errorMessage.classList.remove("hidden");
        return;
    }

    fetch(weatherApi + state)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather alerts.");
            }

            return response.json();
        })
        .then(data => {
            // Clear input after request
            stateInput.value = "";

            // Hide any previous error
            errorMessage.textContent = "";
            errorMessage.classList.add("hidden");

            const alerts = data.features || [];

            alertsDisplay.innerHTML = `<h2>Weather Alerts: ${alerts.length}</h2>`;

            if (alerts.length === 0) {
                const p = document.createElement("p");
                p.textContent = "No active weather alerts.";
                alertsDisplay.appendChild(p);
                return;
            }

            alerts.forEach(alert => {
                const div = document.createElement("div");

                const headline = document.createElement("h3");
                headline.textContent = alert.properties.headline;

                const event = document.createElement("p");
                event.textContent = `Event: ${alert.properties.event}`;

                const description = document.createElement("p");
                description.textContent = alert.properties.description;

                div.appendChild(headline);
                div.appendChild(event);
                div.appendChild(description);

                alertsDisplay.appendChild(div);
            });
        })
        .catch(error => {
            // Clear input after failed request
            stateInput.value = "";

            alertsDisplay.innerHTML = "";

            errorMessage.textContent = error.message;
            errorMessage.classList.remove("hidden");
        });
}