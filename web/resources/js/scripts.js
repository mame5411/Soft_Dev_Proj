
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