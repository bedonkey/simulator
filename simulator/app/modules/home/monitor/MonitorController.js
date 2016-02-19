MonitorController = function($scope, ors, gateway, exchange) {

    $scope.init = function() {
       $scope.exSession = exchange.getSession();
       $scope.gwSession = gateway.getSession();
       $scope.orsSession = ors.getSession();
    }

    $scope.setORSSession = function(ex, session) {
        ors.setSession(ex, session);
        $scope.orsSession[ex] = session;
    }

    $scope.setGWSession = function(ex, session) {
        gateway.setSession(ex, session);
        $scope.gwSession[ex] = session;
    }

    $scope.setEXSession = function(ex, session) {
        exchange.setSession(ex, session);
        $scope.exSession[ex] = session;
    }

    $scope.init();
} 