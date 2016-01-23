GatewayController = function($scope, orderStore) {
    
    $scope.init = function() {
        $scope.orderQueue = orderStore.getAllOrderQueueOnGateway();
    }
    $scope.init();
} 