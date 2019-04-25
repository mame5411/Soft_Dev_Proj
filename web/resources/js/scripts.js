
function get_token() {
	return document.getElementById('user-session-token').innerText;
}

function set_token(token) {
	document.getElementById('user-session-token').innerText = token;
}

function login(username, password) {
	var request = new Request('/loginreq');
	fetch(request).then(function(response) {
		return response.text();
	}).then(function(text) {
		console.log(text.substring(0, 100));
	});

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
	var params = 'template_num=' + template_number;
	http.open("POST", url);
	http.onreadystatechange = (e) => {
		alert(http.responseText)
	}
	http.send(params);
}