// API_BASE_URL is provided by js/flask-auth.js
const newsText = document.querySelector("#newsText");
const characterCount = document.querySelector("#characterCount");
const analyzeButton = document.querySelector("#analyzeNews");

// =========================================
// AI SERVER STATUS ELEMENTS
// =========================================

// Get the green dot element
const serverDot = document.querySelector("#serverDot");

// Get the server status text
const serverStatus = document.querySelector("#serverStatus");

// =========================================
// SAMPLE NEWS BUTTONS
// =========================================

// Get Real News sample button
const sampleRealButton =
    document.querySelector("#sampleReal");

// Get Fake News sample button
const sampleFakeButton =
    document.querySelector("#sampleFake");

// =========================================
// ACTION BUTTONS
// =========================================

// Get Reset button
const resetButton =
    document.querySelector("#resetAnalysis");

// Get Copy button
const copyButton =
    document.querySelector("#copyResult");    

if (newsText && analyzeButton) {

    newsText.addEventListener("input", () => {
        characterCount.textContent =
            `${newsText.value.length} / 5000 Characters`;
    });

    analyzeButton.addEventListener("click", () => {

        const article = newsText.value.trim();

        const status = document.querySelector("#analysisStatus");

        if (article.length < 30) {
            status.textContent =
                "Please enter at least 30 characters.";
            return;
        }

        analyzeButton.disabled = true;
        analyzeButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

        status.textContent = "Analyzing using FactShield AI...";

        fetch(`${API_BASE_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                news: article
            })
        })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || "Prediction failed.");
            }

            return data;
        })
        .then(data => {

            renderResult(data);

            // Update the current user's local detection count.
            try {
                const stats = JSON.parse(localStorage.getItem("stats") || "{}");
                stats.newsCount = Number(stats.newsCount || 0) + 1;
                stats.imageCount = Number(stats.imageCount || 0);
                stats.videoCount = Number(stats.videoCount || 0);
                localStorage.setItem("stats", JSON.stringify(stats));
            } catch (error) {
                console.warn("Could not update detection statistics:", error);
            }

            analyzeButton.disabled = false;

            analyzeButton.innerHTML =
                '<i class="fa-solid fa-magnifying-glass"></i> Analyze News';

        })
        .catch(error => {

            console.error(error);

            status.textContent =
                "Cannot connect to AI server.";

            analyzeButton.disabled = false;

            analyzeButton.innerHTML =
                '<i class="fa-solid fa-magnifying-glass"></i> Analyze News';

        });

    });

}

// =========================================
// LOAD SAMPLE NEWS
// =========================================

// Check if Real News button exists
if (sampleRealButton) {

    // When button is clicked
    sampleRealButton.addEventListener("click", () => {

        // Load a real news example
        newsText.value =
            "The Reserve Bank announced new monetary policy measures after reviewing inflation and economic growth.";

        // Update character counter
        characterCount.textContent =
            `${newsText.value.length} / 5000 Characters`;

    });

}

// Check if Fake News button exists
if (sampleFakeButton) {

    // When button is clicked
    sampleFakeButton.addEventListener("click", () => {

        // Load a fake news example
        newsText.value =
            "Scientists secretly confirmed that aliens have taken control of every major government on Earth.";

        // Update character counter
        characterCount.textContent =
            `${newsText.value.length} / 5000 Characters`;

    });

}

// Check server immediately after page loads
checkServerStatus();

// =======================================================
// Render AI Prediction Result
// =======================================================

function renderResult(result) {
    

    // -----------------------------
    // Get Prediction Text
    // -----------------------------
    const prediction =
        document.querySelector("#prediction");

    // -----------------------------
    // Get Confidence Text
    // -----------------------------
    const confidence =
        document.querySelector("#confidence");

    // -----------------------------
    // Get Probability Bars
    // -----------------------------
    const realFill =
        document.querySelector("#realFill");

    const fakeFill =
        document.querySelector("#fakeFill");

    // -----------------------------
    // Get Probability Text
    // -----------------------------
    const realProbability =
        document.querySelector("#realProbability");

    const fakeProbability =
        document.querySelector("#fakeProbability");

    // -----------------------------
    // Get Current Status
    // -----------------------------
    const status =
        document.querySelector("#analysisStatus");

    // -----------------------------
    // Get Explanation Box
    // -----------------------------
    const explanation =
        document.querySelector("#analysisExplanation");

    // -----------------------------
    // Get Processing Time
    // -----------------------------
    const processingTime =
        document.querySelector("#processingTime");

    // -----------------------------
    // Get Risk Level
    // -----------------------------
    const riskLevel =
        document.querySelector("#riskLevel");

    // =====================================================
    // Update Prediction
    // =====================================================

    if (result.prediction === "REAL") {

        prediction.textContent =
            "🟢 REAL NEWS";

    }
    else {

        prediction.textContent =
            "🔴 FAKE NEWS";

    }

    // =====================================================
    // Update Confidence
    // =====================================================

    confidence.textContent =
        result.confidence + "%";

    // =====================================
// Show processing time
// =====================================

// Display backend processing time
processingTime.textContent =
    result.processing_time + " sec";



// =====================================
// Show risk level
// =====================================

// Display risk level
riskLevel.textContent =
    result.risk_level;    

    // =====================================================
    // Update Probability Bars
    // =====================================================

    realFill.style.width =
        result.real_probability + "%";

    fakeFill.style.width =
        result.fake_probability + "%";

    // =====================================================
    // Update Probability Numbers
    // =====================================================

    realProbability.textContent =
        result.real_probability + "%";

    fakeProbability.textContent =
        result.fake_probability + "%";

    // =====================================================
    // Update Processing Time
    // =====================================================

    if (processingTime) {

        processingTime.textContent =
            result.processing_time + " sec";

    }

    // =====================================================
    // Update Risk Level
    // =====================================================

    if (riskLevel) {

        riskLevel.textContent =
            result.risk_level;

    }

    // =====================================================
    // Update Status
    // =====================================================

    status.textContent =
        "AI analysis completed successfully.";

    // =====================================================
    // Update Explanation
    // =====================================================

    explanation.innerHTML = `

        <li>
            <strong>Prediction :</strong>
            ${result.prediction}
        </li>

        <li>
            <strong>Confidence :</strong>
            ${result.confidence}%
        </li>

        <li>
            <strong>Real Probability :</strong>
            ${result.real_probability}%
        </li>

        <li>
            <strong>Fake Probability :</strong>
            ${result.fake_probability}%
        </li>

        <li>
            <strong>Risk Level :</strong>
            ${result.risk_level}
        </li>

        <li>
            <strong>Processing Time :</strong>
            ${result.processing_time} sec
        </li>

        <li>
            This prediction was generated using
            your trained Logistic Regression model.
        </li>

    `;

}

// =========================================
// CHECK AI SERVER STATUS
// =========================================

// Function to check whether Flask server is running
// =====================================
// Check AI Server Status
// =====================================

function checkServerStatus() {

    // Send GET request to Flask home route
    fetch(`${API_BASE_URL}/`)

    // Server responded successfully
    .then((response) => {

        // Check HTTP status
        if (!response.ok) {

            throw new Error("Server Offline");

        }

        // Green indicator
        serverDot.textContent = "🟢";

        // Update text
        serverStatus.textContent = "AI Server Online";

    })

    // Server not reachable
    .catch(() => {

        // Red indicator
        serverDot.textContent = "🔴";

        // Update text
        serverStatus.textContent = "AI Server Offline";

    });

}

// =========================================
// RESET ANALYSIS
// =========================================

// Check if Reset button exists
if (resetButton) {

    // Run when button is clicked
    resetButton.addEventListener("click", () => {

        // Clear textarea
        newsText.value = "";

        // Reset character counter
        characterCount.textContent =
            "0 / 5000 Characters";

        // Reset prediction
        document.querySelector("#prediction").textContent =
            "Waiting...";

        // Reset confidence
        document.querySelector("#confidence").textContent =
            "-- %";

        // Reset real probability
        document.querySelector("#realProbability").textContent =
            "0%";

        // Reset fake probability
        document.querySelector("#fakeProbability").textContent =
            "0%";

        // Reset progress bars
        document.querySelector("#realFill").style.width =
            "0%";

        document.querySelector("#fakeFill").style.width =
            "0%";

        // Reset status
        document.querySelector("#analysisStatus").textContent =
            "Waiting for analysis...";

        // Reset explanation
        document.querySelector("#analysisExplanation").innerHTML = `
            <li>The prediction explanation will appear here.</li>
            <li>Confidence level will be displayed.</li>
            <li>AI observations will be shown after analysis.</li>
        `;

        // Reset processing time (if available)
        const processing =
            document.querySelector("#processingTime");

        if (processing) {

            processing.textContent =
                "-- sec";

        }

        // Reset risk level (if available)
        const risk =
            document.querySelector("#riskLevel");

        if (risk) {

            risk.textContent =
                "--";

        }

    });

}

// =========================================
// COPY RESULT BUTTON
// =========================================

// Check if Copy button exists
if (copyButton) {

    // Run when button is clicked
    copyButton.addEventListener("click", () => {

        // Get prediction text
        const prediction =
            document.querySelector("#prediction").textContent;

        // Get confidence
        const confidence =
            document.querySelector("#confidence").textContent;

        // Get status
        const status =
            document.querySelector("#analysisStatus").textContent;

        // Create text to copy
        const resultText =

`=========== FACTSHIELD AI ===========
Prediction : ${prediction}
Confidence : ${confidence}
Status : ${status}
====================================`;

        // Copy to clipboard
        navigator.clipboard.writeText(resultText)

        // If copy successful
        .then(() => {

            // Change button text
            copyButton.textContent = "Copied ✔";

            // Change back after 2 seconds
            setTimeout(() => {

                copyButton.textContent =
                    "Copy Result";

            },2000);

        })

        // If copy fails
        .catch(() => {

            alert("Unable to copy result.");

        });

    });

}