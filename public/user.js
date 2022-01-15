// states to grab
let change = document.getElementById("change");



// set up onclick
change.onclick = updateUser;

let curr_uid = (window.location.href).slice("http://localhost:3000/users/".length);

// sends post request with data
function updateUser() {
    let package = {privacy:document.querySelector('input[name="privacy"]:checked').value};
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            // redirects the page, after getting back the new id json of the new restaurant created
            alert("updated");
		}
	}
	req.open("PUT", '/users/'+curr_uid);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(package));

}