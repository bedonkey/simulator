DateTime = {
	getCurentDateTime: function() {
		var currentdate = new Date();
		var h = currentdate.getHours();
		var m = currentdate.getMinutes();
		var s = currentdate.getSeconds();
		var ms = currentdate.getMilliseconds();
		return h + ":"  + m + ":" + s + "." + ms;
	}
}

