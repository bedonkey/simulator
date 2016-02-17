MonitorController = function($scope, ors, gateway, exchange) {
    $scope.init = function() {
       $scope.exSession = exchange.getSession();
       $scope.gwSession = gateway.getSession();
       $scope.orsSession = ors.getSession();
    }

    $scope.setORSSession = function(ex, session) {
        ors.setSession(ex, session);
        $scope.orsSession[ex] = session;
        $scope.mask = false;
        $scope.popupORS = false;
    }

    $scope.setGWSession = function(ex, session) {
        gateway.setSession(ex, session);
        $scope.gwSession[ex] = session;
        $scope.mask = false;
        $scope.popupGW = false;
    }

    $scope.setEXSession = function(ex, session) {
        exchange.setSession(ex, session);
        $scope.exSession[ex] = session;
        $scope.mask = false;
        $scope.popupEX = false;
    }

    $scope.openORS = function() {
        $scope.mask = true;
        $scope.popupORS = true;
    }

    $scope.openGW = function() {
        $scope.mask = true;
        $scope.popupGW = true;
    }

    $scope.openEX = function() {
        $scope.mask = true;
        $scope.popupEX = true;
    }

    $scope.init();
} 