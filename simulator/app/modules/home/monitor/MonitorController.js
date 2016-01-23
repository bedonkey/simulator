MonitorController = function($scope, order, sessionManager) {
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

    $scope.closeGatewaySession = function() {
        sessionManager.closeGateway();
        $scope.gwSession = Session.gw.CLOSE;
    }

    $scope.openGatewaySession = function() {
        sessionManager.openGateway();
        $scope.gwSession = Session.gw.OPEN;
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

    $scope.openORS = function() {
        $scope.mask = true;
        $scope.popupORS = true;
    }

    $scope.init();
} 