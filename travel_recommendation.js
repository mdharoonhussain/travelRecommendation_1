// travel_recommendation.js

document.addEventListener("DOMContentLoaded", function () {
    fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => {
            console.log(data); // You can remove this console.log once you confirm data retrieval

            const searchButton = document.querySelector("#searchButton");
            const clearButton = document.querySelector("#clearButton");

            searchButton.addEventListener("click", function () {
                const userInput = document.querySelector("#searchInput").value.toLowerCase();
                const matchingResults = filterResults(data, userInput);
                displayResults(matchingResults);
                displayLocalTime(matchingResults);
            });

            clearButton.addEventListener("click", function () {
                clearResults();
            });
        })
        .catch(error => console.error("Error fetching data:", error));

    function filterResults(data, userInput) {
        const matchingResults = [];

        // Search in countries
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(userInput)) {
                matchingResults.push({
                    type: "Country",
                    name: country.name,
                    imageUrl: country.cities[0].imageUrl,
                    description: country.cities[0].description,
                    timeZone: country.cities[0].timeZone // Added timeZone property
                });
            }
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(userInput)) {
                    matchingResults.push({
                        type: "City",
                        name: city.name,
                        imageUrl: city.imageUrl,
                        description: city.description,
                        timeZone: city.timeZone // Added timeZone property
                    });
                }
            });
        });

        // Search in temples
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(userInput)) {
                matchingResults.push({
                    type: "Temple",
                    name: temple.name,
                    imageUrl: temple.imageUrl,
                    description: temple.description,
                    timeZone: null // Temples may not have a specific time zone
                });
            }
        });

        // Search in beaches
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(userInput)) {
                matchingResults.push({
                    type: "Beach",
                    name: beach.name,
                    imageUrl: beach.imageUrl,
                    description: beach.description,
                    timeZone: null // Beaches may not have a specific time zone
                });
            }
        });

        return matchingResults;
    }

    function displayResults(results) {
        const resultsContainer = document.querySelector("#resultsContainer");
        resultsContainer.innerHTML = ""; // Clear previous results

        results.forEach(result => {
            const resultElement = document.createElement("div");
            resultElement.innerHTML = `
                <h3>${result.type}: ${result.name}</h3>
                <img src="${result.imageUrl}" alt="${result.name}">
                <p>${result.description}</p>
                <p>Time Zone: ${result.timeZone || "Not specified"}</p>
                <p>Local Time: <span id="${result.name.toLowerCase().replace(/\s+/g, '-')}-time"></span></p>
            `;
            resultsContainer.appendChild(resultElement);
        });
    }

    function displayLocalTime(results) {
        results.forEach(result => {
            const timeElement = document.getElementById(`${result.name.toLowerCase().replace(/\s+/g, '-')}-time`);
            if (timeElement && result.timeZone) {
                const localTime = new Date().toLocaleString('en-US', {
                    timeZone: result.timeZone,
                    timeStyle: 'medium',
                    hourCycle: 'h24'
                });
                timeElement.textContent = localTime;
            }
        });
    }

    function clearResults() {
        const resultsContainer = document.querySelector("#resultsContainer");
        resultsContainer.innerHTML = ""; // Clear results when clear button is clicked
    }
});
