const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  handle_register();
});

const handle_register = async () => {
  const username_value = document.getElementById("username_in").value;
  const email_value = document.getElementById("email_in").value;
  const password_value = document.getElementById("password_in").value;
  
  if (!username_value || !email_value || !password_value) {
    alert("Please fill in all fields");
    return;
  }
  
  if (password_value.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }
  
  const register_data = {
    name: username_value,
    email: email_value,
    password: password_value
  };

  try {
    const response = await fetch("/api/users", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(register_data)
    });
    
    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "/login";
    } else {
      const error_data = await response.json();
      alert(error_data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Network error. Please try again.");
  }
};
