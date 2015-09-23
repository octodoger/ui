var hqcode = angular.module('hqcode', ['ngRoute', 'ngResource', 'toggle-switch']);

hqcode.constant('CONFIG', {
	API_BASE_URL: '' //Autowired from Grunt
});

hqcode.config([ '$routeProvider', function ($routeProvider) {
	$routeProvider.when('/github', {
		templateUrl: '/github.html',
		controller: 'GithubCtrl'
	}).when('/github-login', {
		templateUrl: '/partial/github.html',
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
