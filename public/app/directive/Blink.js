BlinkDirective = function(){
	return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            scope.$watch(function() {return element.attr('data'); },
                function( newValue, oldValue ) {
                    if (scope.dataLoaded &&newValue != undefined && newValue != '' && newValue != 0) {
                        element.addClass('blink'); 
                        setTimeout(function(){ element.removeClass('blink');  }, 500);
                    }
                    
                }
            );
        }
    }
};