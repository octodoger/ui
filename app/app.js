var hqcode = angular.module('hqcode', ['ngRoute', 'ngResource']);

hqcode.config([ '$routeProvider', function ($routeProvider) {
	$routeProvider.when('/github', {
		templateUrl: '/github.html',
		controller: 'GithubCtrl'
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

hqcode.controller('MainController', [ '$scope', '$rootScope', '$location', 'GithubSrv', function ($scope, $rootScope, $location, GithubSrv) {
	GithubSrv.getUrl().then(function (url) {
		$rootScope.githubRedirectUrl = url;
	}, function (err) {
		alert("Could not load redirect github url, because: " + error.getMessage());
	});

	$scope.githubLogin = function () {
		if ($rootScope.githubRedirectUrl) {
			window.location.href = $rootScope.githubRedirectUrl;
		}
	};

}]);

hqcode.factory('GithubOAuth', [ '$resource', function($resource) {
	return $resource('/api/oauth', {id: '@id'});
}]);

hqcode.factory('Github', [ '$resource', function($resource) {
	return $resource('/api/github/repositories', {id: '@id'});
}]);

hqcode.controller('GithubCtrl', [ '$scope', '$rootScope', '$location', 'GithubSrv', function ($scope, $rootScope, $location, GithubSrv) {
	GithubSrv.getRepos().then(function (repos) {
		$scope.githubRepos = repos;
	}, function (err) {
		alert("Could not load repos, because: " + err.getMessage());
	});
}]);

hqcode.factory('GithubSrv', [ 'Github', 'GithubOAuth', '$q', function (Github, GithubOAuth, $q) {
	return {
		getUrl: function () {
			return $q(function (resolve, reject) {
				GithubOAuth.get().$promise.then(function (URL) {
					resolve(URL.githubUrl);
				}, function (err) {
					reject(err);
				});
			});
		},
		getRepos: function () {
			return $q(function (resolve, reject) {
				Github.query().$promise.then(function (repos) {
					resolve(repos);
				}, function (err) {
					reject(err);
				});
			});
		}
	};
}]);
