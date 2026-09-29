// ==========================================
// FACTSHIELD AI - FLASK AUTHENTICATION
// ==========================================

const API_BASE_URL = "http://127.0.0.1:5001";


// ==========================================
// PASSWORD VISIBILITY TOGGLE
// ==========================================

const toggleButtons =
    document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const inputBox = button.parentElement;
        const passwordInput =
            inputBox.querySelector("input");

        const icon =
            button.querySelector("i");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});


// ==========================================
// SIGNUP
// ==========================================

const signupForm =
    document.querySelector("#signupForm");

const successPopup =
    document.querySelector("#successPopup");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ------------------------------------------
            // Get fields
            // ------------------------------------------

            const fullName =
                document.querySelector("#fullName");

            const email =
                document.querySelector("#email");

            const password =
                document.querySelector("#signupPassword");

            const confirmPassword =
                document.querySelector("#confirmPassword");

            const terms =
                document.querySelector("#terms");

            const termsError =
                document.querySelector("#termsError");


            // ------------------------------------------
            // Values
            // ------------------------------------------

            const nameValue =
                fullName.value.trim();

            const emailValue =
                email.value.trim();

            const passwordValue =
                password.value.trim();

            const confirmPasswordValue =
                confirmPassword.value.trim();


            // ------------------------------------------
            // Error elements
            // ------------------------------------------

            const nameError =
                fullName.parentElement.nextElementSibling;

            const emailError =
                email.parentElement.nextElementSibling;

            const passwordError =
                password.parentElement.nextElementSibling;

            const confirmPasswordError =
                confirmPassword.parentElement.nextElementSibling;


            // ------------------------------------------
            // Clear errors
            // ------------------------------------------

            nameError.textContent = "";
            emailError.textContent = "";
            passwordError.textContent = "";
            confirmPasswordError.textContent = "";
            termsError.textContent = "";


            // ------------------------------------------
            // Validation
            // ------------------------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const passwordPattern =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


            // ------------------------------------------
            // Name
            // ------------------------------------------

            if (nameValue === "") {

                nameError.textContent =
                    "Please enter your full name.";

                return;
            }


            // ------------------------------------------
            // Email
            // ------------------------------------------

            if (emailValue === "") {

                emailError.textContent =
                    "Please enter your email address.";

                return;
            }


            if (!emailPattern.test(emailValue)) {

                emailError.textContent =
                    "Please enter a valid email address.";

                return;
            }


            // ------------------------------------------
            // Password
            // ------------------------------------------

            if (passwordValue === "") {

                passwordError.textContent =
                    "Please enter your password.";

                return;
            }


            if (!passwordPattern.test(passwordValue)) {

                passwordError.textContent =
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";

                return;
            }


            // ------------------------------------------
            // Confirm password
            // ------------------------------------------

            if (confirmPasswordValue === "") {

                confirmPasswordError.textContent =
                    "Please confirm your password.";

                return;
            }


            if (passwordValue !== confirmPasswordValue) {

                confirmPasswordError.textContent =
                    "Passwords do not match.";

                return;
            }


            // ------------------------------------------
            // Terms
            // ------------------------------------------

            if (!terms.checked) {

                termsError.textContent =
                    "Please accept the Terms & Conditions.";

                return;
            }


            // ==========================================
            // SEND DATA TO FLASK
            // ==========================================

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            credentials: "include",

                            body: JSON.stringify({
                                fullName: nameValue,
                                email: emailValue,
                                password: passwordValue
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Register response:",
                    data
                );


                // --------------------------------------
                // Registration failed
                // --------------------------------------

                if (!response.ok) {

                    emailError.textContent =
                        data.message ||
                        "Registration failed.";

                    return;
                }


                // --------------------------------------
                // Registration successful
                // --------------------------------------

                if (successPopup) {

                    successPopup.classList.add("show");

                }


                // --------------------------------------
                // Redirect to login
                // --------------------------------------

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 2000);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                alert(
                    "Unable to connect to the authentication server."
                );

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.querySelector("#loginForm");

const loginSuccessPopup =
    document.querySelector("#loginSuccessPopup");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // --------------------------------------
            // Fields
            // --------------------------------------

            const email =
                document.querySelector("#loginEmail");

            const password =
                document.querySelector("#loginPassword");

            const emailError =
                email.parentElement.nextElementSibling;

            const passwordError =
                password.parentElement.nextElementSibling;


            // --------------------------------------
            // Values
            // --------------------------------------

            const emailValue =
                email.value.trim();

            const passwordValue =
                password.value.trim();


            // --------------------------------------
            // Clear errors
            // --------------------------------------

            emailError.textContent = "";
            passwordError.textContent = "";


            // --------------------------------------
            // Basic validation
            // --------------------------------------

            if (emailValue === "") {

                emailError.textContent =
                    "Please enter your email address.";

                return;
            }


            if (passwordValue === "") {

                passwordError.textContent =
                    "Please enter your password.";

                return;
            }


            // ======================================
            // LOGIN WITH FLASK
            // ======================================

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            credentials: "include",

                            body: JSON.stringify({
                                email: emailValue,
                                password: passwordValue
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                // ----------------------------------
                // Login failed
                // ----------------------------------

                if (!response.ok) {

                    passwordError.textContent =
                        data.message ||
                        "Invalid email or password.";

                    return;
                }


                // ----------------------------------
                // Login successful
                // ----------------------------------

                // Keep a small compatibility copy for older UI code.
                // Flask session remains the real authentication source.
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                localStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("isLoggedIn", "true");

                resetAuthCache();


                if (loginSuccessPopup) {

                    loginSuccessPopup.classList.add("show");

                }


                // ----------------------------------
                // Redirect
                // ----------------------------------

                setTimeout(() => {

                    const redirectPage =
                        localStorage.getItem(
                            "redirectPage"
                        );


                    if (redirectPage) {

                        localStorage.removeItem(
                            "redirectPage"
                        );


                        if (
                            redirectPage.startsWith("#")
                        ) {

                            window.location.href =
                                "index.html" +
                                redirectPage;

                        } else {

                            window.location.href =
                                redirectPage;

                        }

                    } else {

                        window.location.href =
                            "index.html";

                    }

                }, 1500);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    "Unable to connect to the authentication server."
                );

            }

        }
    );

}


// ==========================================
// CURRENT USER CACHE
// ==========================================

let currentUserCache = null;

let currentUserLoaded = false;

let currentUserRequest = null;
let navbarInitialized = false;

// ==========================================
// NAVBAR REQUEST LOCK
// ==========================================

let navbarUpdateRequest = null;


// ==========================================
// GET CURRENT USER FROM FLASK
// ==========================================

async function getCurrentUser() {

    // ------------------------------------------
    // 1. Already loaded → return cached user
    // ------------------------------------------

    if (currentUserLoaded) {
        return currentUserCache;
    }

    // ------------------------------------------
    // 2. Request already running
    //    → DO NOT send another request
    // ------------------------------------------

    if (currentUserRequest) {
        return currentUserRequest;
    }

    // ------------------------------------------
    // 3. Make ONE request
    // ------------------------------------------

    currentUserRequest = fetch(
        `${API_BASE_URL}/auth/me`,
        {
            method: "GET",
            credentials: "include"
        }
    )
    .then(async response => {

        const data = await response.json();

        if (response.ok && data.authenticated === true) {

            currentUserCache = data.user || data;

        } else {

            currentUserCache = null;

        }

        currentUserLoaded = true;

        return currentUserCache;
    })
    .catch(error => {

        console.error("Authentication check failed:", error);

        currentUserCache = null;
        currentUserLoaded = true;

        return null;

    })
    .finally(() => {

        // Request finished.
        // Future calls use currentUserCache.
        currentUserRequest = null;

    });

    return currentUserRequest;
}

// ==========================================
// RESET AUTH CACHE
// ==========================================

function resetAuthCache() {

    currentUserCache =
        null;

    currentUserLoaded =
        false;

    currentUserRequest =
        null;

}




// ==========================================
// LOGOUT USER
// ==========================================

async function logoutUser() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        if (!response.ok) {
            console.error("Logout failed:", response.status);
        }

    } catch (error) {

        console.error("Logout request failed:", error);

    } finally {

        // Clear client-side compatibility state.
        localStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        localStorage.removeItem("redirectPage");

        // Clear the in-memory auth cache.
        resetAuthCache();
        navbarInitialized = false;
        navbarUpdateRequest = null;

        window.location.href = "index.html";
    }
}


// ==========================================
// UPDATE NAVBAR
// ==========================================

async function updateNavbar() {

    const navButtons = document.querySelector("#navButtons");

    if (!navButtons) {
        return;
    }

    // ------------------------------------------
    // Prevent multiple navbar initializations
    // ------------------------------------------

    if (navbarInitialized) {
        return;
    }

    navbarInitialized = true;

    // ------------------------------------------
    // Get current user
    // ------------------------------------------

    const user = await getCurrentUser();

    // ------------------------------------------
    // USER LOGGED IN
    // ------------------------------------------

    if (user) {

        navButtons.innerHTML = `
            <button
                class="login-btn"
                id="profileBtn"
                type="button">
                Profile
            </button>

            <button
                class="register-btn"
                id="logoutBtn"
                type="button">
                Logout
            </button>
        `;

        // Profile button

        const profileBtn =
            document.getElementById("profileBtn");

        if (profileBtn) {

            profileBtn.addEventListener("click", function () {

                window.location.href = "profile.html";

            });
        }

        // Logout button

        const logoutBtn =
            document.getElementById("logoutBtn");

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                async function () {

                    await logoutUser();

                }
            );
        }

    }

    // ------------------------------------------
    // USER NOT LOGGED IN
    // ------------------------------------------

    else {

        navButtons.innerHTML = `
            <button
                class="login-btn"
                type="button"
                onclick="location.href='login.html'">
                Login
            </button>

            <button
                class="register-btn"
                type="button"
                onclick="location.href='signup.html'">
                Register
            </button>
        `;
    }
}


// ==========================================
// CHECK LOGIN BEFORE OPENING PAGE/SECTION
// ==========================================

async function checkLogin(target) {

    const user =
        await getCurrentUser();


    // ==========================================
    // USER LOGGED IN
    // ==========================================

    if (user) {

        // --------------------------------------
        // Internal section
        // --------------------------------------

        if (target.startsWith("#")) {

            const section =
                document.querySelector(
                    target
                );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth"
                });


            } else {

                window.location.href =
                    "index.html" +
                    target;

            }


        } else {

            // ----------------------------------
            // Another page
            // ----------------------------------

            window.location.href =
                target;

        }


        return;

    }


    // ==========================================
    // USER NOT LOGGED IN
    // ==========================================

    localStorage.setItem(
        "redirectPage",
        target
    );


    console.log(
        "Saved Redirect:",
        target
    );


    window.location.href =
        "login.html";

}


// ==========================================
// REQUIRE LOGIN FOR PROTECTED PAGES
// ==========================================

async function requireLogin(targetPage) {

    const user = await getCurrentUser();

    // User is authenticated -> stay on the current page.
    if (user) {
        return true;
    }

    // User is not authenticated -> remember where
    // they wanted to go, then send them to login.
    localStorage.setItem("redirectPage", targetPage);

    window.location.href = "login.html";

    return false;
}


// ==========================================
// INITIALIZE NAVBAR
// ==========================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            updateNavbar();
        },
        { once: true }
    );

} else {

    updateNavbar();

}