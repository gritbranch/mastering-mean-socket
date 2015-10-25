//angular.module() retrieves the example module
//controller() creates a new ExampleController constructor function
angular.module('example').controller('ExampleController', ['$scope', 'Authentication', function($scope, Authentication) {
	$scope.authentication = Authentication;
  }
]);