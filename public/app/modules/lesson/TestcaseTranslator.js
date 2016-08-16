TestCaseTranslator = function() {
};

TestCaseTranslator.prototype = {
    translate: function(input) {
        if (input.indexOf('#')) {
            return input.split('#')[1];
        }
    }
}   
