MonitorController = function($scope, ors, gateway, exchange) {

    $scope.init = function() {
       $scope.exSession = exchange.getSession();
       $scope.gwSession = gateway.getSession();
       $scope.orsSession = ors.getSession();
       $scope.module = "";
    }

    $scope.setSession = function(ex, session) {
        if ($scope.module == "ors") {
            ors.setSession(ex, session);
            $scope.orsSession[ex] = session;
        }
        if ($scope.module == "gateway") {
            gateway.setSession(ex, session);
            $scope.gwSession[ex] = session;
        }
        if ($scope.module == "exchange") {
            exchange.setSession(ex, session);
            $scope.exSession[ex] = session;
        }
        
        $scope.mask = false;
        $scope.popupSetSession = false;
    }

    $scope.openPopup = function(module) {
        $scope.module = module;
        $scope.mask = true;
        $scope.popupSetSession = true;
    }

    $scope.init();
} 