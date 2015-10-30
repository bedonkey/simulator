var app = angular.module("mainapp", []);
app.directive('ngEnter', EnterHandleDirective);
app.directive('ngCommand', CommandHandleDirective);
app.directive('uppercased', UppercaseDirective);

app.service('accountValidator', AccountValidator);
app.service('account', ['accountValidator', 'aftype', Account]);
app.service('aftype', ['basket', AfType]);
app.service('basket', Basket);
app.service('orderValidator', ['account', 'secinfo', 'aftype', OrderValidator]);
app.service('order', ['orderValidator', 'aftype', 'orderStore', 'matcher', 'account', 'priceBoard', Order]);
app.service('secInfoValidator', SecInfoValidator);
app.service('secinfo', ['secInfoValidator', SecInfo]);
app.service('priceBoard', ['secinfo', PriceBoard]);
app.service('matcher', ['account', 'orderStore', 'priceBoard', Matcher]);
app.service('orderStore', OrderStore);
app.service('dockService', ['account', 'secinfo', DockService]);
app.service('logScreen', LogScreen);
app.service('interpreter', ['logScreen', 'order', 'account', Interpreter]);

app.controller("TabsCtrl", ['$scope', TabController]);
app.controller('ExchangeController', ['$scope', 'matcher', ExchangeController]);
app.controller("SecInfoController", ['$scope', 'secinfo', SecInfoController]);
app.controller("AccountController", ['$scope', 'account', 'aftype', AccountController]);
app.controller("AfTypeController", ['$scope', 'aftype', 'basket', AfTypeController]);
app.controller("BasketController", ['$scope', 'basket', BasketController]);
app.controller("OrderBookController", ['$scope', 'order', 'orderStore', 'dockService', OrderBookController]);
app.controller("PriceBoardController", ['$scope', 'priceBoard', PriceBoardController]);
app.controller("DockController", ['$scope', 'order', 'dockService', DockController]);
app.controller("RobotController", ['$scope', '$http', 'logScreen', 'interpreter', RobotController]);

app.directive("orderDetail", function(){
  return {
    templateUrl: 'app/components/order/detail.html'
  };
});

app.directive("orderReplace", function(){
  return {
    templateUrl: 'app/components/order/replace.html'
  };
});

app.directive("accountAdd", function(){
  return {
    templateUrl: 'app/components/account/add.html'
  };
});

app.directive("secinfoAdd", function(){
  return {
    templateUrl: 'app/components/secinfo/add.html'
  };
});

app.directive("aftypeAdd", function(){
  return {
    templateUrl: 'app/components/aftype/add.html'
  };
});

app.directive("basketAdd", function(){
  return {
    templateUrl: 'app/components/basket/add.html'
  };
});

app.directive("mask", function(){
  return {
    templateUrl: 'app/shared/mask.html'
  };
});

app.directive('autofocus', function(){
  return function(scope, element){
    element[0].focus();
  };
});

app.directive('cellChange', function(){
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
});

app.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === "true") { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
});