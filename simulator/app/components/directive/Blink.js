BlinkDirective = function(){
	return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            scope.$watch(function() {return element.attr('data-qty'); },
                function( newValue, oldValue ) {
                    if (newValue != undefined && newValue != '' && newValue != 0) {
                        console.log(newValue);
                        element.addClass('blink'); 
                        setInterval(function(){ element.removeClass('blink');  }, 500);  
                    }
                    
                }
            );
        }
    }
};