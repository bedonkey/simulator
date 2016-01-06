ExchangeController = function($scope, exchange, exSecinfo) {
    $scope.search = {
        symbol : ''
    };
    
    $scope.init = function() {
        $scope.orderBuy = exchange.getAllOrderBuy();
        $scope.orderSell = exchange.getAllOrderSell();
        $scope.session = exchange.getSession();
    }

    $scope.openSession = function() {
    	$scope.session = 'OPEN';
    	exchange.open();
    }

    $scope.closeSession = function() {
    	$scope.session = 'CLOSE';
    	exchange.close();
        exchange.expiredOrders();
    }
    $scope.init();
} 