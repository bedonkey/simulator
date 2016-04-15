ExSecInfoValidator = function() {
};

ExSecInfoValidator.prototype = {
	clientValidate: function(sec) {
        if (sec.symbol == undefined) return "Symbol not empty";
        if (sec.floor == undefined) return "Floor price not empty";
        if (sec.ceil == undefined) return "Ceil price not empty";
	}
}	
