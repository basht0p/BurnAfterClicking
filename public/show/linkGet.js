const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString)

const iv = urlParams.get('i')
const key = urlParams.get('n')

var ivReq = "/api/linkget?i=" + iv

const linkGetAjax = {
	"type": 'GET',
	"url": ivReq,
	"dataType": 'json',
	"async": false
}

var response = $.ajax(linkGetAjax)

var cryptokey = CryptoJS.enc.Utf8.parse(key);
var cryptoiv = CryptoJS.enc.Utf8.parse(iv);

var decryptedMsg = CryptoJS.AES.decrypt(
	response.responseJSON.result,
	cryptokey,
	{
		'iv': cryptoiv
	}
).toString(CryptoJS.enc.Utf8);

document.getElementById('link').value = decryptedMsg;