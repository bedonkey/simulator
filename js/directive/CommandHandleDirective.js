CommandHandleDirective = function(){
	return {
		link: function (scope, element, attrs) {
	        element.bind("keyup", function (event) {
				console.log(event.which)
	            if(event.which !== 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngCommand);
	                });
	                event.preventDefault();
	            } else {
	            	scope.$apply(function (){
	                    scope.$eval(attrs.ngPlace);
	                });
	                event.preventDefault();
	            }
	        });
		}
	};
};