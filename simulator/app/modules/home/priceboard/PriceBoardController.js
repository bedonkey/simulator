PriceBoardController = function($scope, priceBoard) {
    $scope.dataLoaded = false;

    $scope.init = function() {
        $scope.board = priceBoard.getAll();
        setTimeout(function(){ $scope.dataLoaded = true }, 500);
    }

    $scope.updateColor = function(price, ref) {
        if(price != undefined) {
            if(price < ref) {
                return 'red';
            } else if(price > ref) {
                return 'green';
            } else {
                return 'yellow';
            }
        }
    }

    $scope.init();
} 