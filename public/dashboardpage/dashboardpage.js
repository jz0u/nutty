const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  handle_log_submittion();
});

const handle_log_submittion = async () => {
  // get form data
  const food_name = document.getElementById("food_in").value;
  const calorie = document.getElementById("calorie_in").value;
  const serving_size = document.getElementById("serving_size_in").value;
  
  if (!food_name || !calorie || !serving_size) {
    alert("Please fill in all fields");
    return;
  }
  
  // get current date and time
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
  
  const log_data = {
    name: food_name,
    calorie: parseInt(calorie),
    serving_size: parseInt(serving_size),
    time: time,
    date: date
  };

  // get token
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No authentication token found. Please login again.");
    window.location.href = "/login";
    return;
  }
  
  try {
    const response = await fetch("api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(log_data)
    });

    if (response.ok) {
      alert("Food logged successfully!");
      form.reset();
    } else {
      const error_data = await response.json();
      alert(error_data.message || "Failed to log food");
    }
  } catch (error) {
    console.error("Log submission error:", error);
    alert("Network error. Please try again.");
  }
};
