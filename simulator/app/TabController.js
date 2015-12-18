TabController = function($scope) {
    $scope.currentTab = 'app/components/exchange/exchange.html';

    $scope.showDock = function() {
        if ($scope.currentTab.indexOf('orderbook') > -1 || $scope.currentTab.indexOf('priceboard') > -1) {
            $scope.isShowDock = true;
        } else {
            $scope.isShowDock = false;
        }
    }
    
    $scope.showDock();

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab;
        $scope.showDock();
    }
} 