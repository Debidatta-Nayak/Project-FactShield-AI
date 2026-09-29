const mediaInput = document.querySelector("#mediaInput");
const uploadArea = document.querySelector("#uploadArea");
const mediaName = document.querySelector("#mediaName");
const analyzeMedia = document.querySelector("#analyzeMedia");

if (mediaInput) {
    mediaInput.addEventListener("change", () => {
        const file = mediaInput.files[0];
        if (!file) return;
        uploadArea.classList.add("is-ready");
        mediaName.textContent = `${file.name} (${Math.ceil(file.size / 1024)} KB)`;
    });

    analyzeMedia.addEventListener("click", () => {
        const file = mediaInput.files[0];
        const status = document.querySelector("#mediaStatus");
        if (!file) {
            status.textContent = "Choose a file before starting the analysis.";
            return;
        }
        analyzeMedia.disabled = true;
        analyzeMedia.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        status.textContent = "Preparing the file for a demo analysis...";
        window.setTimeout(() => {
            document.querySelector("#mediaPrediction").textContent = "Analysis ready";
            document.querySelector("#mediaConfidence").textContent = "Demo mode";
            status.textContent = "File accepted. Connect a detection API to produce a real verdict.";
            analyzeMedia.disabled = false;
            analyzeMedia.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Analyze File';
        }, 800);
    });
}
