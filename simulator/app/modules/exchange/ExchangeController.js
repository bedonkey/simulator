ExchangeController = function($scope, exchange) {
    $scope.search = {
        symbol : ''
    };
    
    $scope.init = function() {
        $scope.orderBuy = exchange.getAllOrderBuy();
        $scope.orderSell = exchange.getAllOrderSell();
    }
    $scope.init();
} 