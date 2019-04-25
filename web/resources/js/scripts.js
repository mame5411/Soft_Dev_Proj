
function login(username, password) {
	var request = new Request('/loginreq');
	fetch(request).then(function(response) {
		return response.text();
	}).then(function(text) {
		console.log(text.substring(0, 100));
	});

}