const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  handle_login();
});

const handle_login = async () => {
  const username_value = document.getElementById("username_in").value;
  const password_value = document.getElementById("password_in").value;
  
  if (!username_value || !password_value) {
    alert("Please fill in all fields");
    return;
  }
  
  const login_data = {
    name: username_value,
    password: password_value
  };

  try {
    const response = await fetch("api/users/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login_data)
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      window.location.href = "/dashboard";
    } else {
      const error_data = await response.json();
      alert(error_data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Network error. Please try again.");
  }
};