ExchangeValidator = function(secinfo) {
  this.secinfo = secinfo;
};

ExchangeValidator.prototype = {
	validateSecInfo: function(ord) {
        var secs = this.secinfo.get(ord.symbol);
        if (secs.length == 0) return ErrorCode.EX_01;
        if (ord.price < secs[0].floor && ord.type != Session.ATO) return ErrorCode.EX_02;
        if (ord.price > secs[0].ceil && ord.type != Session.ATO) return ErrorCode.EX_03;
        if (secs[0].status == 'H') return ErrorCode.EX_04;
	}
}	
