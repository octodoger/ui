var hqcode = angular.module('hqcode', ['ngRoute', 'ngResource']);

hqcode.config([ '$routeProvider', function ($routeProvider) {
	$routeProvider.when('/github-login', {
		templateUrl: '/github-login.html',
		controller: 'GithubLoginCtrl'
	});
}]);

hqcode.run(['$http', function ($http) {
	if (localStorage.getItem('token')) {
		$http.defaults.headers.common['token'] = localStorage.getItem('token');
		console.log('login from localStorage');
	} else {
		console.log('Need auth');
	}
}]);

hqcode.factory('hqcode', [ '$resource', function($resource) {
	return $resource('/api/hqcode/:id', {id: '@id'});
}]);

hqcode.controller('GithubLoginCtrl', [ '$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
	alert("GITHUB LOGIN");
	
	$scope.login = function (token) {
		$http.defaults.headers.common['token'] = token;
		localStorage.setItem('token', token);
	};
}]);
