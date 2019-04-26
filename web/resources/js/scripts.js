
function login(user, pass) {
	const http = new XMLHttpRequest();
	const url = '/login';
	http.open("POST", url, true);
	http.setRequestHeader("Content-Type", "application/json");
	http.onreadystatechange = function() {
		if (http.readyState === 4 && http.status === 200) {
			// var response = JSON.parse(http.responseText);
			// set_token(response.token);
		}
	}
	var data = JSON.stringify({"user":user, "pass":pass});
	http.send(data);
}

function change_education(num) {
	for(let i = 1; i <= 4; ++i) {
		if(num == i) {
			document.getElementById('education-history-' + i).style.display = "block";
			document.getElementById('education-button-' + i).classList.add('active');
		}
		else {
			document.getElementById('education-history-' + i).style.display = "none";
			document.getElementById('education-button-' + i).classList.remove('active');
		}
	}
}

function change_employment(num) {
	for(let i = 1; i <= 4; ++i) {
		if(num == i) {
			document.getElementById('employment-history-' + i).style.display = "block";
			document.getElementById('employment-button-' + i).classList.add('active');
		}
		else {
			document.getElementById('employment-history-' + i).style.display = "none";
			document.getElementById('employment-button-' + i).classList.remove('active');
		}
	}
}

function request_generate(template_number) {
	const http = new XMLHttpRequest();
	const url = '/generate';
	http.open("POST", url, true);
	http.setRequestHeader("Content-Type", "application/json");
	http.onreadystatechange = (e) => {
		if (http.readyState === 4 && http.status === 200) {
			var response = JSON.parse(http.responseText);
			document.location = '/results';
		}
	}
	var data = JSON.stringify({"template_num":template_number,});
	http.send(data);
}

function form_login() {
	login(document.getElementById('username').value, document.getElementById('password').value);
}