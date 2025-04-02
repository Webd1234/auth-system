console.log("📌 Current Page:", window.location.pathname); // Check current page

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js has been loaded successfully!");

	const submitSurveyButton = document.getElementById("submit-survey-btn");
	   
	   if (submitSurveyButton) {
	       console.log("✅ Found submit button!");
	       submitSurveyButton.addEventListener("click", submitSurvey);
	   } else {
	       console.error("❌ Submit button NOT FOUND!");
	   }
	
	
	
	
	
	
    // 🚀 Handle Login Page
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        console.log("✅ Found login form");
        loginForm.addEventListener("submit", login);
    } else {
        console.warn("⚠️ No login form found!");
    }

    // 🚀 Handle Signup Page
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        console.log("✅ Found signup form");
        signupForm.addEventListener("submit", signup);
    }

    // 🚀 Handle Constituency Selection Page
    if (window.location.pathname.includes("select_constituency.html")) {
        console.log("🏛️ Constituency Selection Page Detected!");

        const constituencySelect = document.getElementById("constituency");
        const proceedButton = document.getElementById("proceed-btn");

        console.log("🔍 Finding proceedButton:", proceedButton);

        if (!proceedButton) {
            console.error("❌ proceedButton NOT FOUND! Check if it's in the HTML.");
            return; // Stop execution if button is missing
        }

        console.log("✅ proceedButton found!");

        proceedButton.addEventListener("click", function () {
            if (!constituencySelect) {
                console.error("❌ constituencySelect NOT FOUND!");
                return;
            }

            const constituencyName = constituencySelect.value.trim();

            if (!constituencyName) {
                alert("⚠️ Please select a constituency.");
                return;
            }

            console.log("✅ Saving constituency:", constituencyName);
            localStorage.setItem("selectedConstituency", constituencyName);

            console.log("🔄 Redirecting to survey.html...");
            window.location.href = "survey.html";
        });
    }

    // 🚀 Handle Survey Page
    if (window.location.pathname.includes("survey.html")) {
        console.log("📝 Survey page detected!");

        const questionsContainer = document.getElementById("questions-container");
        const constituencyName = localStorage.getItem("selectedConstituency");

        console.log("🔍 Retrieved constituency from localStorage:", constituencyName);

        if (!constituencyName) {
            console.error("❌ No constituency found in localStorage!");
            questionsContainer.innerHTML = "<p>⚠️ Error: No constituency selected.</p>";
            return;
        }

        const constituencyId = constituencyMapping[constituencyName];
        console.log("✅ Mapped constituency ID:", constituencyId);

        if (!constituencyId) {
            console.error("❌ Invalid constituency selection!");
            questionsContainer.innerHTML = "<p>⚠️ Error: Invalid constituency selected.</p>";
            return;
        }

        fetchQuestions(constituencyId);
    }
	
	
	// 🔹 Fetch Email and Update Checkbox Section
	        const userEmail = localStorage.getItem("userEmail");
	        const emailSpan = document.getElementById("user-email");
	        const emailCheckbox = document.getElementById("include-email");

	        if (userEmail) {
	            emailSpan.textContent = userEmail;
	        } else {
	            emailSpan.textContent = "Unavailable";
	            emailCheckbox.disabled = true; // Disable checkbox if no email found
	        }
	
});

// ⬇️ Function to Fetch Questions from API
function fetchQuestions(constituencyId) {
    console.log("📡 Fetching questions for constituency ID:", constituencyId);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
        console.error("❌ No JWT token found! Redirecting to login...");
        window.location.href = "index.html";
        return;
    }

    fetch(`http://form.jpran.in/api/questions/${constituencyId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log("🔄 API Response Status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Questions received:", data);
        displayQuestions(data);
    })
    .catch(error => {
        console.error("❌ Failed to load questions:", error);
        document.getElementById("questions-container").innerHTML = "<p>⚠️ Failed to load questions.</p>";
    });
}

// ⬇️ Function to Display Question
function displayQuestions(questions) {
    console.log("🎯 Displaying Questions:", questions);

    const questionsContainer = document.getElementById("questions-container");
    questionsContainer.innerHTML = "";

    if (questions.length === 0) {
        console.warn("⚠️ No questions available for this constituency.");
        questionsContainer.innerHTML = "<p>No questions available.</p>";
        return;
    }

    questions.forEach((question) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        let inputHtml = "";

        if (question.options.includes("Free Text - User Input")) {
            // Create a text input for user input questions
            inputHtml = `<input type="text" name="question${question.id}" placeholder="Type your answer here..." class="text-input">`;
        } else {
            // Create radio buttons for multiple-choice questions
            const options = question.options.split(",").map(opt => opt.trim()); // Ensure no accidental newlines

            inputHtml = options.map(option => `
                <label style="white-space: nowrap; display: flex; align-items: center; gap: 8px;">
                    <input type="radio" name="question${question.id}" value="${option}">
                    ${option}
                </label>
            `).join("");
        }

        questionDiv.innerHTML = `
            <p><strong>${question.questionText}</strong></p>
            <div class="options-container">${inputHtml}</div>
            <hr>
        `;

        questionsContainer.appendChild(questionDiv);
    });
}








// ⬇️ Function to Handle Login
async function login(event) {
    event.preventDefault();
    console.log("🔑 Login button clicked!");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://form.jpran.in/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    console.log("🔄 API Response Status:", response.status);

    if (response.ok) {
        const data = await response.json();
		
        console.log("✅ Login successful! Token:", data.token);
		
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("userEmail", email);
        
        // Redirect directly to select_constituency after successful login
        window.location.href = "/select_constituency.html";
    } else {
        console.error("❌ Invalid email or password!");
        alert("Invalid email or password");
    }
}

// ⬇️ Function to Handle Signup
async function signup(event) {
    event.preventDefault();
    console.log("📝 Signup button clicked!");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://form.jpran.in/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    console.log("🔄 API Response Status:", response.status);

    if (response.ok) {
        console.log("✅ Signup successful!");
        alert("Signup successful! Redirecting to login...");
        window.location.href = "index.html";
    } else {
        console.error("❌ Signup failed!");
        alert("Signup failed. Try again.");
    }
}

// ⬇️ Function to Toggle Password Visibility
function togglePassword(id) {
    const inputField = document.getElementById(id);
    inputField.type = inputField.type === "password" ? "text" : "password";
}


const constituencyMapping = {
    "Abhayapuri North": 81,
    "Abhayapuri South": 82,
    "Algapur": 8,
    "Amguri": 37,
    "Badarpur": 5,
    "Baghbar": 86,
    "Baithalangso": 53,
    "Bajali": 116,
    "Barama": 72,
    "Barchalla": 57,
    "Barhampur": 109,
    "Barkhetry": 15,
    "Barpeta": 84,
    "Batadrava": 117,
    "Behali": 61,
    "Bhabanipur": 104,
    "Bhergaon": 69,
    "Bihali": 59,
    "Bihpuria": 120,
    "Bijni": 25,
    "Bilasipara East": 20,
    "Bilasipara West": 19,
    "Biswanath": 62,
    "Bokajan": 51,
    "Boko": 74,
    "Bongaigaon": 83,
    "Borkhola": 14,
    "Chabua": 45,
    "Chapaguri": 26,
    "Chaygaon": 73,
    "Chenga": 88,
    "Dalgaon": 68,
    "Darrang": 121,
    "Dharmapur": 90,
    "Dhekiajuli": 58,
    "Dhemaji": 30,
    "Dhing": 106,
    "Dholai": 11,
    "Dhubri": 16,
    "Dibrugarh": 40,
    "Digboi": 47,
    "Diphu": 52,
    "Dispur": 93,
    "Doom Dooma": 50,
    "Dudhnoi": 80,
    "Duliajan": 42,
    "East Guwahati": 100,
    "Gauripur": 17,
    "Goalpara East": 77,
    "Goalpara West": 78,
    "Gohpur": 27,
    "Golakganj": 18,
    "Goreswar": 102,
    "Gossaigaon": 21,
    "Guwahati East": 94,
    "Guwahati West": 96,
    "Hailakandi": 6,
    "Hajo": 97,
    "Howraghat": 54,
    "Jagiroad": 110,
    "Jaleswar": 79,
    "Jalukbari": 95,
    "Jania": 85,
    "Jonai": 31,
    "Jorhat": 34,
    "Kalaigaon": 63,
    "Kamalpur": 92,
    "Karimganj North": 3,
    "Karimganj South": 4,
    "Katigorah": 122,
    "Katlicherra": 7,
    "Khoirabari": 71,
    "Kokrajhar East": 23,
    "Kokrajhar West": 22,
    "Laharighat": 112,
    "Lahowal": 41,
    "Lakhimpur": 29,
    "Lakhipur": 13,
    "Majuli": 32,
    "Mangaldoi": 67,
    "Mankachar": 76,
    "Margherita": 48,
    "Mariani": 35,
    "Mazbat": 65,
    "Moran": 39,
    "Morigaon": 111,
    "Nagaon": 108,
    "Naharkatia": 44,
    "Nalbari": 89,
    "Naoboicha": 28,
    "Nazira": 38,
    "North Guwahati": 99,
    "Nowgong": 113,
    "Palasbari": 98,
    "Patharkandi": 2,
    "Pattacharkuchi": 115,
    "Rangapara": 55,
    "Rangiya": 91,
    "Ratabari": 1,
    "Rupahi": 118,
    "Rupohihat": 107,
    "Sadiya": 49,
    "Samaguri": 119,
    "Sarukhetri": 87,
    "Sidli": 24,
    "Silchar": 9,
    "Sipajhar": 66,
    "Sonai": 10,
    "Sootea": 60,
    "South Salmara": 75,
    "Tamaghat": 103,
    "Tamulpur": 105,
    "Tangla": 70,
    "Teok": 36,
    "Tezpur": 56,
    "Tihu": 114,
    "Tingkhong": 43,
    "Tinsukia": 46,
    "Titabor": 33,
    "Udalguri": 64,
    "Udharbond": 12,
    "West Guwahati": 101
};


async function submitSurvey(event) {
    event.preventDefault();
    console.log("📝 Submitting survey...");

    // Retrieve constituencyId from localStorage
    const constituencyName = localStorage.getItem("selectedConstituency");
    const constituencyId = constituencyMapping[constituencyName];

    if (!constituencyId) {
        console.error("❌ Invalid constituency ID. Survey cannot be submitted.");
        alert("❌ Invalid constituency. Survey cannot be submitted.");
        return;
    }

    // Retrieve email if consent is given
    const emailCheckbox = document.getElementById("include-email").checked;
    const email = emailCheckbox ? localStorage.getItem("userEmail") : null;

    // Initialize an empty object to store responses
    let responses = {};

    // Collect answers from the form
    document.querySelectorAll(".question").forEach(questionDiv => {
        const questionId = questionDiv.querySelector("input, select").name.replace("question", "");  // Get question ID
        const questionInput = questionDiv.querySelector("input, select");

        // For free text input fields
        if (questionInput.type === "text") {
            responses[questionId] = questionInput.value;  // Store the text response
        } 
        // For multiple choice questions (radio buttons)
        else if (questionInput.type === "radio" && questionInput.checked) {
            responses[questionId] = questionInput.value;  // Store the selected radio option
        }
    });

    console.log("Collected responses:", responses);

    // Prepare the data to be sent to the backend
    const responseData = {
        constituencyId: constituencyId,  // Include the constituency ID
        email: email,  // Include the email if consent is provided
        responses: JSON.stringify(responses)  // Send responses as a JSON string
    };

    const token = localStorage.getItem("jwtToken");

    // Send the collected responses to the backend via a POST request
    const response = await fetch("http://form.jpran.in/api/survey/submit", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(responseData)
    });

    // Check if the submission was successful
    if (response.ok) {
        alert("✅ Survey submitted successfully!");
       // window.location.href = "dashboard.html";  // Redirect after submission
    } else {
        alert("❌ Failed to submit survey!");
    }
}


document.getElementById("submit-survey-btn").addEventListener("submit", submitSurvey);

