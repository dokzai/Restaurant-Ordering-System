// states to grab
let user_reg = {};
let username_reg = document.getElementById("regusername");
let password_reg = document.getElementById("regpassword");
let register = document.getElementById("register");
let error_msg = document.getElementById("message");

// set up onclick
register.onclick = verifySubmission;

// verifies submission to add restaurant
function verifySubmission() {
    let error_message = "";
    let alert_needed = false;
    if (username_reg.value === "") {
      error_message += "username_reg field is empty. ";
        alert_needed = true;
    }
    if (password_reg.value === "") {
        error_message += "password_reg field is empty. ";
        alert_needed = true;
    }

    if (alert_needed == true) {
        alert(error_message);
    }
    else {
        // send post request
        reg_attempt();
    }
}

// sends post request with data
function reg_attempt() {
    user_reg.username= username_reg.value;
    user_reg.password = password_reg.value;

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            // redirects the page, after getting back the new id json of the new restaurant created
            window.location.href = "http://localhost:3000/";
		}else {
            error_msg.innerHTML = "";
            let info = document.createTextNode("username taken");
            error_msg.appendChild(info);
        }
	}
	req.open("POST", `/register`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(user_reg));

}