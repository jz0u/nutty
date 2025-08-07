const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  handle_log_submittion();
});

const handle_log_submittion = async () => {
      // Get form data
  const food_name = document.getElementById("food_in").value;
  const calorie = document.getElementById("calorie_in").value;
  const serving_size = document.getElementById("serving_size_in").value;
  
  // Get current date and time
  const now = new Date();
  const date = now.toLocaleDateString(); // YYYY-MM-DD format
  const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0'); // HH:MM:SS format
  
  const log_data = {
    name: food_name,
    calorie: calorie,
    serving_size: serving_size,
    time:time,
    date:date
  };

  //get token

  const token = localStorage.getItem("access_token");
    if (!token) {
    alert("No authentication token found. Please login again.");
    window.location.href = "/login";
    return;
  }
  try{
    const response = await fetch("api/logs",{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify(log_data)
    });

    if(response.ok){
        const data = await response.json();
        console.log(data);
        form.reset();
    } else {
        console.error(response.status);
    }
  }catch(error){
    console.error(error);
  }

};
