TestCaseTranslator = function() {
};

TestCaseTranslator.prototype = {
    translate: function(input) {
        if (input.indexOf('#')) {
            console.log("Translate this:" + input)
            return input.split('#')[1];
        }
    }
}   
