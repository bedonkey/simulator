SecInfoValidator = function() {
};

SecInfoValidator.prototype = {
	clientValidate: function(sec) {
		var error = "";
    if (sec.symbol == undefined) {
        error = "Symbol not empty";
    } else if (sec.floor == undefined) {
        error = "Floor price not empty";
    } else if (sec.ceil == undefined) {
        error = "Ceil price not empty";
    }
    return error;
	}
}	
