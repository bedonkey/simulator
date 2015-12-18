BasketController = function($scope, basket) {
   
    $scope.aftypes = basket.getAll();

    $scope.openEditBox = function(bak) {
        $scope.mask=true;
        $scope.popupOpen=true;
        $scope.basketDetail = bak;
    }

    $scope.closeEditBox = function() {
        $scope.isAddBox = false;
    }

    $scope.openAddBox = function() {
        $scope.isAddBox = true;
        $scope.basketDetail = {};
        $scope.addError = "";
    }

    $scope.add = function() {
        var result = basket.add($scope.basketDetail);
        if(result != "") {
            $scope.addError = result;
        } else {
            $scope.mask = false;
            $scope.popupOpen = false;
        }
    }

    $scope.remove = function(bak) {
        basket.delete(bak.id);
    }

    $scope.addSymbol = function(data) {
        if($scope.basketDetail.data == undefined) {
            $scope.basketDetail.data = [];
        }
        var data = {};
        $scope.basketDetail.data.push(data);
    }

    $scope.removeSymbol = function(id, data) {
        basket.deleteSymbol(id, data);
    }
} 