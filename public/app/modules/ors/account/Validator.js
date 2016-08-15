AccountValidator = function() {
};

AccountValidator.prototype = {
	clientValidate: function(account) {
		var error = "";
		if (account.id == undefined) {
        	error = "Account ID not empty";
	    } else if (account.balance == undefined) {
	        error = "Balance not empty";
	    }
	    return error;
	},

	serverValidate: function(order) {
		
	}
}	
