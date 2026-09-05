const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const actionSelect = document.getElementById("actionSelect");
const styleSelect = document.getElementById("styleSelect");
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

// Photo preview
photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) {
        preview.innerHTML = "<p>Your photo preview will appear here</p>";
        return;
    }

    const imageURL = URL.createObjectURL(file);

    preview.innerHTML = `
        <img 
            src="${imageURL}" 
            alt="Uploaded photo"
            style="max-width: 100%; max-height: 300px; border-radius: 10px;"
        >
    `;
});

// Generate action scene
generateBtn.addEventListener("click", async () => {

    const action = actionSelect.value;
    const movieStyle = styleSelect.value;

    result.innerHTML = "<p>⏳ Generating your AI action movie scene...</p>";

    try {

        const response = await fetch("http://localhost:3000/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: action,
                movieStyle: movieStyle
            })
        });

        const data = await response.json();

        if (!response.ok) {
            result.innerHTML = `
                <p>❌ ${data.error || "Generation failed"}</p>
            `;
            return;
        }

        result.innerHTML = `
            <div>
                <h3>🎬 AI Action Movie Scene</h3>

                <p>
                    <strong>Action:</strong>
                    ${data.action}
                </p>

                <p>
                    <strong>Movie Style:</strong>
                    ${data.style}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${data.status}
                </p>

                <hr>

                <h4>🤖 AI Generated Script</h4>

                <div style="
                    white-space: pre-wrap;
                    line-height: 1.6;
                    padding: 15px;
                    border-radius: 10px;
                    background: #f5f5f5;
                ">
                    ${data.script || "No script returned."}
                </div>
            </div>
        `;

    } catch (error) {

        console.error("Frontend Error:", error);

        result.innerHTML = `
            <p>❌ Backend connection failed.</p>
            <p>Make sure your Node.js server is running.</p>
        `;
    }
});