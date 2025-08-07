const form = document.querySelector("form");
const logoutBtn = document.getElementById("logout_btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handle_log_submittion();
});
window.addEventListener("load", fetch_username);
window.addEventListener("load", fetch_logs);

logoutBtn.addEventListener("click", () => {
  handle_logout();
});

// Function to handle logout
const handle_logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  alert("Logged out successfully!");
  window.location.href = "/login";
};

// Function to refresh access token
const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch("api/users/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

// Function to make authenticated API calls with automatic token refresh
const makeAuthenticatedRequest = async (url, options = {}) => {
  let token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token available");
  }

  // Add authorization header
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    let response = await fetch(url, options);

    // If token expired, try to refresh and retry
    if (response.status === 401 || response.status === 403) {
      try {
        token = await refreshAccessToken();
        options.headers["Authorization"] = `Bearer ${token}`;
        response = await fetch(url, options);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        alert("Session expired. Please login again.");
        window.location.href = "/login";
        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

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
  const time =
    now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0");

  const log_data = {
    name: food_name,
    calorie: parseInt(calorie),
    serving_size: parseInt(serving_size),
    time: time,
    date: date,
  };

  try {
    const response = await makeAuthenticatedRequest("api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log_data),
    });

    if (response.ok) {
      alert("Food logged successfully!");
      form.reset();
      // Refresh logs after a successful submission
      fetch_logs();
    } else {
      const error_data = await response.json();
      alert(error_data.message || "Failed to log food");
    }
  } catch (error) {
    console.error("Log submission error:", error);
    alert("Network error. Please try again.");
  }
};

const create_entry_btn = document.querySelector("#create_btn");
let is_open = false;

create_entry_btn.addEventListener("click", () => {
  handle_open_close();
});

const handle_open_close = () => {
  if (is_open) {
    close_form();
    is_open = false;
  } else {
    open_form();
    is_open = true;
  }
};

const open_form = () => {
  document.getElementById("formdiv").classList.add("show_box");
};

const close_form = () => {
  document.getElementById("formdiv").classList.remove("show_box");
  document.getElementById("food_in").value = "";
  document.getElementById("calorie_in").value = "";
  document.getElementById("serving_size_in").value = "";
};

// Function to fetch and display username
async function fetch_username() {
  try {
    const response = await makeAuthenticatedRequest("api/users/me", {
      method: "GET",
    });

    if (response.ok) {
      const userData = await response.json();
      const usernameElement = document.getElementById("username");
      if (usernameElement && userData.name) {
        usernameElement.textContent = userData.name;
      }
    } else {
      console.error("Failed to fetch username");
    }
  } catch (error) {
    console.error("Error fetching username:", error);
  }
}

async function fetch_logs() {
  try {
    const response = await makeAuthenticatedRequest("api/logs", {
      method: "GET",
    });
    if (response.ok){
      const logs = await response.json();
      render_logs(logs);
      return logs;
    } else {
      console.error("Failed to fetch logs");
    }
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
}

function render_logs(logs) {
  const container = document.getElementById("logsdiv");
  if (!container) return;

  let html = '<h3>your logs:</h3>';

  if (!Array.isArray(logs) || logs.length === 0) {
    html += '<p>No logs yet. Create your first entry above.</p>';
    container.innerHTML = html;
    return;
  }

  html += `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Food</th>
          <th>Calories</th>
          <th>Serving Size</th>
        </tr>
      </thead>
      <tbody>
        ${logs
          .map(
            (log) => `
              <tr>
                <td>${log.date ?? ''}</td>
                <td>${log.time ?? ''}</td>
                <td>${log.name ?? ''}</td>
                <td>${log.calorie ?? ''}</td>
                <td>${log.serving_size ?? ''}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}
