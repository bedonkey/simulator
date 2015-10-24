IdGenerator = {
	orderId: 0,
	getId: function() {
		return this.orderId++;
	}
}

