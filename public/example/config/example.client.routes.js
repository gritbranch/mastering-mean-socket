//Uses the angular.module() method to grab the example module and executed the config() method to create a new configuration block
angular.module('example').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'example/views/example.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);