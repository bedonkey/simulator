ExchangeController = function($scope, orderStore) {
    $scope.search = {
        symbol : ''
    };
    
    $scope.init = function() {
        $scope.orderBuy = orderStore.getAllOrderBuy();
        $scope.orderSell = orderStore.getAllOrderSell();
    }
    $scope.init();
} 