MonitorController = function($scope, order, gateway, sessionManager) {
    $scope.init = function() {
       $scope.exSession = sessionManager.getExchangeSession();
       $scope.gwSession = sessionManager.getGatewaySession();
       $scope.orsSession = sessionManager.getORSSession();
    }

    $scope.closeExchangeSession = function() {
        sessionManager.closeExchange();
        $scope.exSession = Session.ex.CLOSE;
    }

    $scope.openExchangeSession = function() {
        sessionManager.openExchange();
        $scope.exSession = Session.ex.OPEN;
    }

    $scope.setORSSession = function(session) {
        sessionManager.setORSSession(session);
        if (session == Session.ors.OPEN) {
            order.fireOrder();
        }
        $scope.orsSession = session;
        $scope.mask = false;
        $scope.popupORS = false;
    }

    $scope.setGWSession = function(session) {
        sessionManager.setGatewaySession(session);
        if (session == Session.gw.OPEN) {
            console.log("Push order to Exchange");
            gateway.fireOrder();
        }
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