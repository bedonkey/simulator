MonitorController = function($scope, order, ors, gateway, exchange) {
    $scope.init = function() {
       $scope.exSession = exchange.getSession();
       $scope.gwSession = gateway.getSession();
       $scope.orsSession = ors.getSession();
    }

    $scope.closeExchangeSession = function() {
        exchange.setSession(Session.ex.CLOSE);
        $scope.exSession = Session.ex.CLOSE;
    }

    $scope.openExchangeSession = function() {
        exchange.setSession(Session.ex.OPEN);
        $scope.exSession = Session.ex.OPEN;
    }

    $scope.setORSSession = function(session) {
        ors.setSession(session);
        $scope.orsSession = session;
        $scope.mask = false;
        $scope.popupORS = false;
    }

    $scope.setGWSession = function(session) {
        gateway.setSession(session);
        $scope.gwSession = session;
        $scope.mask = false;
        $scope.popupGW = false;
    }

    $scope.openORS = function() {
        $scope.mask = true;
        $scope.popupORS = true;
    }

    $scope.openGW = function() {
        $scope.mask = true;
        $scope.popupGW = true;
    }

    $scope.init();
} 