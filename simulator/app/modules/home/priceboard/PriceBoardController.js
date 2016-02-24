PriceBoardController = function($scope, priceBoard) {
    $scope.dataLoaded = false;

    $scope.init = function() {
        $scope.board = priceBoard.getAll();
        setTimeout(function(){ $scope.dataLoaded = true }, 500);
    }

    $scope.updateColor = function(price, row) {
        if(price != undefined) {
            if (price == row.floor) {
                return 'floor';
            }
            if(row.floor < price && price < row.ref) {
                return 'red';
            }
            if (price == row.ref) {
                return 'yellow';
            }
            if(row.ref < price && price < row.ceil) {
                return 'green';
            }
            if (price == row.ceil) {
                return 'ceil';
            }
        }
    }

    $scope.init();
} 