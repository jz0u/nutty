const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  handle_login();
});

const handle_login = async() =>{
    const username_value = document.getElementById("username_in").value;
    const password_value = document.getElementById("password_in").value;
    const login_data = {
      name: username_value,
      password: password_value
    };

    try{
        const response = await fetch("api/users/login", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(login_data)
        });
        if (response.ok){
            localStorage.setItem("access_token",data.access_token);
            window.location.href="/dashboard";
        }
    } catch (error){
       console.error(error);
    }
};