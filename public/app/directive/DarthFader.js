DarthFaderDirective = function(){
	return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var duration = attrs.fadeDuration || 200;
            $scope.$watch(attrs.fadeShown, function(value) {
                if (value)
                    $(element).fadeIn(duration);
                else
                    $(element).fadeOut(duration);
            });
        }
    };
};