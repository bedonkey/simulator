CellChangeDirective = function(){
	return { 
      link: function(scope, element, attr){
        var dcell = attr.dcell;
        console.log(JSON.stringify(eval("(" + dcell + ")")));
        console.log(attr.dref);
        var price = attr.dcell.px;
        var ref = attr.dref;
        if(price != undefined) {
            if(price < ref) {
                element.addClass('red');
            } else if(price > ref) {
                element.addClass('green');
            } else {
                element.addClass('yellow');
            }
        }
      }
    }
};