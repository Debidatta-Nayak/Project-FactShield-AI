// ==========================================
// PASSWORD VISIBILITY TOGGLE
// ==========================================

// Select all password toggle buttons
const toggleButtons = document.querySelectorAll(".toggle-password");

// Loop through every eye button
toggleButtons.forEach(button => {

    // Add click event
    button.addEventListener("click", () => {

        // Parent input box
        const inputBox = button.parentElement;

        // Find password input
        const passwordInput = inputBox.querySelector("input");

        // Find eye icon
        const icon = button.querySelector("i");

        // Check current input type
        if(passwordInput.type === "password"){

            // Show password
            passwordInput.type = "text";

            // Change icon
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        }

        else{

            // Hide password
            passwordInput.type = "password";

            // Restore icon
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});

/// ==========================================
// SIGNUP VALIDATION
// ==========================================

// Select the signup form
const signupForm = document.querySelector("#signupForm");

const successPopup = document.querySelector("#successPopup");





// Run only if we are on signup.html
if (signupForm) {

    // Listen for form submission
    signupForm.addEventListener("submit", (event) => {

        // Stop the page from refreshing
        event.preventDefault();

        // ===============================
        // Select Input Fields
        // ===============================

        const fullName = document.querySelector("#fullName");
        const email = document.querySelector("#email");
        const password = document.querySelector("#signupPassword");
        const confirmPassword = document.querySelector("#confirmPassword");
        const terms = document.querySelector("#terms");

        // ===============================
        // Get User Values
        // ===============================

        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();
        
        

        // ===============================
        // Get Error Message Elements
        // ===============================

        const nameError = fullName.parentElement.nextElementSibling;
        const emailError = email.parentElement.nextElementSibling;
        const passwordError = password.parentElement.nextElementSibling;
        const confirmPasswordError =
            confirmPassword.parentElement.nextElementSibling;

        // ===============================
        // Clear Previous Errors
        // ===============================

        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";termsError.textContent = "";


        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // ===============================
        // Name Validation
        // ===============================

        if (nameValue === "") {

            nameError.textContent = "Please enter your full name.";

            return;

        }

        // ===============================
// Email Validation
// ===============================

// Check if email field is empty
if(emailValue === ""){

    emailError.textContent = "Please enter your email address.";

    return;

}

// Check if email format is valid
if(!emailPattern.test(emailValue)){

    emailError.textContent = "Please enter a valid email address.";

    return;

}
// ===============================
// Password Pattern
// ===============================

// Minimum 8 characters
// At least 1 uppercase
// At least 1 lowercase
// At least 1 number
// At least 1 special character

const passwordPattern =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ===============================
// Password Validation
// ===============================

// Check if password field is empty
if(passwordValue === ""){

    passwordError.textContent =
    "Please enter your password.";

    return;

}

// Check password strength
if(!passwordPattern.test(passwordValue)){

    passwordError.textContent =
    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";

    return;

}
// ===============================
// Confirm Password Validation
// ===============================

// Check if confirm password is empty
if(confirmPasswordValue === ""){

    confirmPasswordError.textContent =
    "Please confirm your password.";

    return;

}

// Check if passwords match
if(passwordValue !== confirmPasswordValue){

    confirmPasswordError.textContent =
    "Passwords do not match.";

    return;

}
// ===============================
// Terms & Conditions Validation
// ===============================

if(!terms.checked){

    termsError.textContent =
    "Please accept the Terms & Conditions.";

    return;

}
successPopup.classList.add("show");

const user = {

    fullName: nameValue,

    email: emailValue,

    password: passwordValue

};
// ===============================
// Save User in Browser
// ===============================

localStorage.setItem("user", JSON.stringify(user));
//console.log(localStorage.getItem("user"));

// ===============================
// Redirect to Login Page
// ===============================

setTimeout(() => {

    window.location.href = "login.html";

}, 2000);

    });

}
// ==========================================
// LOGIN
// ==========================================

const loginForm = document.querySelector("#loginForm");
const loginSuccessPopup =
document.querySelector("#loginSuccessPopup");


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // ==========================
        // Get Input Fields
        // ==========================

        const email = document.querySelector("#loginEmail");
        const password = document.querySelector("#loginPassword");
        const rememberMe = document.querySelector("#rememberMe");

        // ==========================
        // Get Values
        // ==========================

        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();

        // ==========================
        // Error Elements
        // ==========================

        const emailError = email.parentElement.nextElementSibling;
        const passwordError = password.parentElement.nextElementSibling;

        emailError.textContent = "";
        passwordError.textContent = "";

        // ==========================
        // Read User from LocalStorage
        // ==========================

        const savedUser = JSON.parse(localStorage.getItem("user"));

        // ==========================
        // Check User Exists
        // ==========================
  

        if (!savedUser) {

            emailError.textContent = "No account found.";

            return;
        }

        // ==========================
        // Email Check
        // ==========================

        if (emailValue !== savedUser.email) {

            emailError.textContent = "Invalid Email";

            return;
        }

        // ==========================
        // Password Check
        // ==========================

        if (passwordValue !== savedUser.password) {

            passwordError.textContent = "Incorrect Password";

            return;
        }

       // ==========================
// Login Successful
// ==========================


// Save Login Session
// ==========================
// Remember Me
// ==========================

// Remove any previous login session
localStorage.removeItem("isLoggedIn");
sessionStorage.removeItem("isLoggedIn");

// Save login according to Remember Me
if (rememberMe.checked) {

    localStorage.setItem("isLoggedIn", "true");

} else {

    sessionStorage.setItem("isLoggedIn", "true");

}
// Show Success Popup
loginSuccessPopup.classList.add("show");

// Redirect after 2 seconds
setTimeout(() => {

    // Get the page/section that the user wanted to visit before login
    const redirectPage = localStorage.getItem("redirectPage");

    // Check if a redirect page exists
    if (redirectPage) {

        // Remove it after reading so it doesn't affect future logins
        localStorage.removeItem("redirectPage");

        // Check if the saved target is a section ID (e.g. "#services")
        if (redirectPage.startsWith("#")) {

            // Open index.html and automatically scroll to that section
            window.location.href = "index.html" + redirectPage;

        } else {

            // Otherwise, redirect to the saved page
            window.location.href = redirectPage;

        }

    } else {

        // If no redirect page was saved, go to the home page
        window.location.href = "index.html";

    }

}, 2000);
    });

}

// ==========================================
// UPDATE NAVBAR
// ==========================================

function updateNavbar() {

    // Select Navbar Button Container
    const navButtons = document.querySelector("#navButtons");

    // Stop if navbar doesn't exist
    if (!navButtons) return;

    // Check Login Status
    const isLoggedIn =
        localStorage.getItem("isLoggedIn") ||
        sessionStorage.getItem("isLoggedIn");

    // If user is logged in
    if (isLoggedIn === "true") {

        navButtons.innerHTML = `

            <button class="login-btn" id="profileBtn">
                Profile
            </button>

            <button class="register-btn" id="logoutBtn">
                Logout
            </button>

        `;
                document.getElementById("profileBtn").addEventListener("click", () => {

            // Open profile page
            window.location.href = "profile.html";

        });

        // Logout Button
        document
            .querySelector("#logoutBtn")
            .addEventListener("click", () => {

                // Remove Login Session
                localStorage.removeItem("isLoggedIn");
                sessionStorage.removeItem("isLoggedIn");

                // Reload Home Page
                window.location.href = "index.html";

            });

    }

}

// ==========================================
// CHECK LOGIN BEFORE OPENING A PAGE/SECTION
// ==========================================

function checkLogin(target) {

    // Read the login status from Local Storage
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Check if the user is logged in
    if (isLoggedIn === "true") {

        // Check whether the target is a section ID
        // Example: "#services", "#about"
        if (target.startsWith("#")) {

            // Smoothly scroll to that section on the current page
            document.querySelector(target).scrollIntoView({
                behavior: "smooth"
            });

        } else {

            // Otherwise, redirect to another page
            // Example: profile.html, dashboard.html
            window.location.href = target;

        }

    } else {

        // User is not logged in

        // Save the page/section the user wanted to visit
        // so we can redirect after successful login
        localStorage.setItem("redirectPage", target);

        console.log("Saved Redirect:", target);
        // Redirect the user to the Login page
        window.location.href = "login.html";

    }

}

updateNavbar();