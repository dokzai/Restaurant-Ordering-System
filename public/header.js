// states to grab
let user_data = {};
let username = document.getElementById("username");
let password = document.getElementById("password");
let login = document.getElementById("login");
let message = document.getElementById("message");

// set up onclick
login.onclick = verifySubmission;

// verifies submission to add restaurant
function verifySubmission() {
    let error_message = "";
    let alert_needed = false;
    if (username.value === "") {
      error_message += "username field is empty. ";
        alert_needed = true;
    }
    if (password.value === "") {
        error_message += "password field is empty. ";
        alert_needed = true;
    }

    if (alert_needed == true) {
        alert(error_message);
    }
    else {
        // send post request
        login_attempt();
    }
}

// sends post request with data
function login_attempt() {
    user_data.username = username.value;
    user_data.password = password.value;

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            // redirects the page, after getting back the new id json of the new restaurant created
            window.location.href = "http://localhost:3000/";
		}else {
            message.innerHTML = "";
            let info = document.createTextNode("Invalid credentials");
            message.appendChild(info);
        }
	}
	req.open("POST", `/login`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(user_data));

}