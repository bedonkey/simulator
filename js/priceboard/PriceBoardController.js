PriceBoardController = function($scope, priceBoard) {

    $scope.init = function() {
        $scope.board = priceBoard.getAll();
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

    $scope.showhide = function(data) {
        return data.px > 0 && data.qty > 0;
    }

    $scope.init();
} 