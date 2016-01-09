MonitorController = function($scope, sessionManager) {
    $scope.init = function() {
       $scope.exSession = sessionManager.getExchangeSession();
       $scope.gwSession = sessionManager.getGatewaySession();
       $scope.orsSession = sessionManager.getORSSession();
    }

    $scope.closeExchangeSession = function() {
        sessionManager.closeExchange();
        $scope.exSession = Session.exchange.CLOSE;
    }

    $scope.openExchangeSession = function() {
        sessionManager.openExchange();
        $scope.exSession = Session.exchange.OPEN;
    }

    $scope.closeGatewaySession = function() {
        sessionManager.closeGateway();
        $scope.gwSession = Session.gateway.CLOSE;
    }

    $scope.openGatewaySession = function() {
        sessionManager.openGateway();
        $scope.gwSession = Session.gateway.OPEN;
    }

    $scope.setORSSession = function(session) {
        sessionManager.setORSSession(session);
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