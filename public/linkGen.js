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

	var duration = $("#messageForm").find('select[name="ttl"]').val();

	var expiration = new Date();

	expiration.setMinutes( expiration.getMinutes() + parseInt(duration))

	var msgInput = $("#messageForm").find('textarea[name="message"]').val();

	var encryptedMsg = encryptMsg(msgInput)

	// AJAX options for LinkGen POST
	var postData = {
		"data": (encryptedMsg.toString()),
		"iv": ivInit,
		"ttl": expiration.getTime()
	}
	const linkGenAjax = {
		"type": 'POST',
		"url": "/api/linkgen",
		"dataType": 'json',
		"data": postData,
		"async": false
	}

	// Send the post
	$.ajax(linkGenAjax);

	// Set link field to newly created link
	document.getElementById('link').value = "https://burnafterclicking.com/show/?i=" + ivInit + "&n=" + keyInit
	
	function setHeight(fieldId) {
		document.getElementById(fieldId).style.height = document.getElementById(fieldId).scrollHeight + 'px';
	}
	setHeight('link');
});