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
    <table class="logs-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Food</th>
          <th>Calories</th>
          <th>Serving Size</th>
          <th class="actions-col">Actions</th>
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
                <td>
                  <button class="edit-btn" data-id="${log._id}">Edit</button>
                  <button class="delete-btn" data-id="${log._id}">Delete</button>
                </td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;
};

document.getElementById("logsdiv").addEventListener("click", async (event) => {
  const button = event.target;
  const logId = button.getAttribute("data-id");
  
  if (!logId) return;

  if (button.classList.contains("edit-btn")) {
    handleEdit(logId);
  } else if (button.classList.contains("delete-btn")) {
    handleDelete(logId);
  } else if (button.classList.contains("save-btn")) {
    handleSave(logId);
  } else if (button.classList.contains("cancel-btn")) {
    handleCancel(button);
  }
});

function handleEdit(logId) {
  // Find the row for this log via the Edit button and closest tr (more compatible than :has)
  const editButton = document.querySelector(`button.edit-btn[data-id="${logId}"]`);
  if (!editButton) return;
  const row = editButton.closest("tr");
  if (!row) return;

  // Get all data cells (skip the actions column)
  const cells = row.querySelectorAll("td");
  const dateCell = cells[0];
  const timeCell = cells[1];
  const foodCell = cells[2];
  const calorieCell = cells[3];
  const servingSizeCell = cells[4];
  const actionsCell = cells[5];

  // Store original values on the row dataset for safe cancel restore
  row.dataset.origDate = dateCell.textContent;
  row.dataset.origTime = timeCell.textContent;
  row.dataset.origFood = foodCell.textContent;
  row.dataset.origCalorie = calorieCell.textContent;
  row.dataset.origServing = servingSizeCell.textContent;

  // Replace cells with input fields
  dateCell.innerHTML = `<input type="text" value="${row.dataset.origDate}" class="edit-input">`;
  timeCell.innerHTML = `<input type="text" value="${row.dataset.origTime}" class="edit-input">`;
  foodCell.innerHTML = `<input type="text" value="${row.dataset.origFood}" class="edit-input">`;
  calorieCell.innerHTML = `<input type="number" value="${row.dataset.origCalorie}" class="edit-input">`;
  servingSizeCell.innerHTML = `<input type="number" value="${row.dataset.origServing}" class="edit-input">`;

  // Replace Edit/Delete with Save/Cancel
  actionsCell.innerHTML = `
    <button class="save-btn" data-id="${logId}">Save</button>
    <button class="cancel-btn" data-id="${logId}">Cancel</button>
  `;
}

async function handleSave(logId) {
  // Find the row via the Save button
  const saveButton = document.querySelector(`button.save-btn[data-id="${logId}"]`);
  if (!saveButton) return;
  const row = saveButton.closest("tr");
  if (!row) return;

  const cells = row.querySelectorAll("td");
  const dateInput = cells[0].querySelector(".edit-input");
  const timeInput = cells[1].querySelector(".edit-input");
  const foodInput = cells[2].querySelector(".edit-input");
  const calorieInput = cells[3].querySelector(".edit-input");
  const servingInput = cells[4].querySelector(".edit-input");

  const updateData = {
    date: dateInput ? dateInput.value : row.dataset.origDate || "",
    time: timeInput ? timeInput.value : row.dataset.origTime || "",
    name: foodInput ? foodInput.value : row.dataset.origFood || "",
    calorie: calorieInput ? parseInt(calorieInput.value) : parseInt(row.dataset.origCalorie || "0"),
    serving_size: servingInput ? parseInt(servingInput.value) : parseInt(row.dataset.origServing || "0"),
  };

  try {
    const response = await makeAuthenticatedRequest(`api/logs/${logId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      // Refresh the table to reflect changes
      await fetch_logs();
    } else {
      const error_data = await response.json().catch(() => ({}));
      alert(error_data.message || "Failed to update entry");
    }
  } catch (error) {
    console.error("Update error:", error);
    alert("Network error. Please try again.");
  }
}

function handleCancel(button) {
  const row = button.closest("tr");
  if (!row) return;

  const cells = row.querySelectorAll("td");
  const dateCell = cells[0];
  const timeCell = cells[1];
  const foodCell = cells[2];
  const calorieCell = cells[3];
  const servingSizeCell = cells[4];
  const actionsCell = cells[5];

  // Restore from dataset
  dateCell.textContent = row.dataset.origDate || "";
  timeCell.textContent = row.dataset.origTime || "";
  foodCell.textContent = row.dataset.origFood || "";
  calorieCell.textContent = row.dataset.origCalorie || "";
  servingSizeCell.textContent = row.dataset.origServing || "";

  const logId = button.getAttribute("data-id");
  actionsCell.innerHTML = `
    <button class="edit-btn" data-id="${logId}">Edit</button>
    <button class="delete-btn" data-id="${logId}">Delete</button>
  `;
}

async function handleDelete(logId) {
  const confirmed = window.confirm("Are you sure you want to delete this entry?");
  if (!confirmed) return;

  try {
    const response = await makeAuthenticatedRequest(`api/logs/${logId}`, { method: "DELETE" });
    if (response.ok) {
      await fetch_logs();
    } else {
      const error_data = await response.json().catch(() => ({}));
      alert(error_data.message || "Failed to delete entry");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Network error. Please try again.");
  }
}