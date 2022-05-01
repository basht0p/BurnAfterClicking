
function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
};

// Initialize key and initVector values as UTF8
var ivInit = makeid(16);
var keyInit = makeid(16);


function encryptMsg(msg) {

	var key = CryptoJS.enc.Utf8.parse(keyInit);
	var iv = CryptoJS.enc.Utf8.parse(ivInit);

	var encryptedMsg = CryptoJS.AES.encrypt(
		msg,
		key,
		{
			'iv': iv
		}
	);

	return encryptedMsg
}

$("#messageForm").submit(function (event) {

	event.preventDefault();

	var msgInput = $("#messageForm").find('input[name="message"]').val();

	var encryptedMsg = encryptMsg(msgInput)

	// AJAX options for LinkGen POST
	var postData = {
		"data": (encryptedMsg.toString()),
		"iv": ivInit
	}
	const linkGenAjax = {
		"type": 'POST',
		"url": "/api/linkgen",
		"dataType": 'json',
		"data": postData,
		"async": false
	}

	// Send the data using post
	$.ajax(linkGenAjax);

	// Set link field to newly created link
	document.getElementById('link').value = "http://localhost:8080/show/?i=" + ivInit + "&n=" + keyInit

});