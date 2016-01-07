ExchangeValidator = function(secinfo) {
  this.secinfo = secinfo;
};

ExchangeValidator.prototype = {
	validateSecInfo: function(ord) {
        var secs = this.secinfo.get(ord.symbol);
        if (secs.length == 0) return "Symbol not exist";
        if (ord.price < secs[0].floor) return "Price must larger than floor price";
        if (ord.price > secs[0].ceil) return "Price must lower than ceil price";
        if (secs[0].status == 'H') return "Symbol is halt";
	}
}	
