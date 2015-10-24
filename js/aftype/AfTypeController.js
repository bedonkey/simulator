AfTypeController = function($scope, aftype, basket) {
   
    $scope.aftypes = aftype.getAll();
    $scope.baskets = basket.getAll();

    $scope.openEditBox = function(type) {
        $scope.mask=true;
        $scope.popupOpen=true;
        $scope.afTypeDetail = type;
    }

    $scope.closeEditBox = function() {
        $scope.isAddBox = false;
    }

    $scope.openAddBox = function() {
        $scope.isAddBox = true;
        $scope.afTypeDetail = {};
        $scope.addError = "";
    }

    $scope.add = function() {
        var result = aftype.add($scope.afTypeDetail);
        if(result != "") {
            $scope.addError = result;
        } else {
            $scope.mask = false;
            $scope.popupOpen = false;
        }
    }

    $scope.remove = function(type) {
        aftype.delete(type.name);
    }
} 