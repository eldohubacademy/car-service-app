// Get elements
const signinTab = document.getElementById("signin");
const registerTab = document.getElementById("register");
const signinForm = document.getElementById("signin-window");
const registerForm = document.getElementById("register-window");

// Function to switch tabs
function switchTab(event) {
  const clickedTab = event.target;

  // Remove 'active' class from all tabs
  signinTab.classList.remove("active");
  registerTab.classList.remove("active");

  // Hide both forms
  signinForm.classList.remove("active");
  registerForm.classList.remove("active");

  // Add 'active' class to clicked tab and corresponding form
  if (clickedTab === signinTab) {
    signinTab.classList.add("active");
    signinForm.classList.add("active");
  } else {
    registerTab.classList.add("active");
    registerForm.classList.add("active");
  }
}

// Add event listeners
signinTab.addEventListener("click", switchTab);
registerTab.addEventListener("click", switchTab);

// Set default tab (Sign In)
document.addEventListener("DOMContentLoaded", () => {
  signinForm.classList.add("active");
});

// Get the form elements
const roleSelect = document.getElementById("role-register");
const emailField = document.getElementById("email-field");
const addressField = document.getElementById("address-field");
const specialtyField = document.getElementById("specialty-field");

// Function to show/hide fields based on role selection
function handleRoleChange() {
  const selectedRole = roleSelect.value;

  // Hide all fields by default
  emailField.style.display = "none";
  addressField.style.display = "none";
  specialtyField.style.display = "none";

  if (selectedRole === "client") {
    // Show email and address for clients
    emailField.style.display = "block";
    addressField.style.display = "block";
  } else if (selectedRole === "mechanic") {
    // Show specialty for mechanics
    specialtyField.style.display = "block";
  }
}

// Add event listener to role select element
roleSelect.addEventListener("change", handleRoleChange);

// Function to show the alert and auto-hide it after 10 seconds
function showAlert() {
  const alert = document.getElementById("alert");

  // Make the alert visible
  alert.classList.remove("hide");

  // Hide the alert after 10 seconds (10000 milliseconds)
  setTimeout(() => {
    alert.classList.add("hide");
  }, 10000);
}

// Call the function to display the alert (triggered when needed)
showAlert();
