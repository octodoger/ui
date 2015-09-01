var hqcode = angular.module('hqcode', ['ngRoute', 'ngResource', 'toggle-switch']);

hqcode.config([ '$routeProvider', function ($routeProvider) {
	$routeProvider.when('/github', {
		templateUrl: '/github.html',
		controller: 'GithubCtrl'
	}).when('/github-login', {
		templateUrl: '/github.html',
		controller: 'GithubLoginCtrl'
	});
}]);

hqcode.constant('CONFIG', {
	API_BASE_URL: '' //Autowired from Grunt
});

hqcode.run(['$http', function ($http) {
	if (localStorage.getItem('token')) {
		$http.defaults.headers.common['token'] = localStorage.getItem('token');
		console.log('login from localStorage');
	} else {
		console.log('Need auth');
	}
}]);

hqcode.controller('MainController', [ '$scope', '$rootScope', '$location', 'GithubSrv', 'LoginSrv', function ($scope, $rootScope, $location, GithubSrv, LoginSrv) {
	GithubSrv.getOAuthInfo().then(function (oAuthInfo) {
		$rootScope.githubRedirectUrl = oAuthInfo.githubUrl;
		LoginSrv.login(oAuthInfo.token);
	}, function (err) {
		alert("Could not load redirect github url, because: " + err.message);
	});

	$scope.githubLogin = function () {
		if ($rootScope.githubRedirectUrl) {
			window.location.href = $rootScope.githubRedirectUrl;
		}
	};
}]);

hqcode.factory('GithubOAuth', [ '$resource', 'CONFIG', function ($resource, CONFIG) {
	return $resource(CONFIG.API_BASE_URL + '/api/oauth', {id: '@id'});
}]);

hqcode.factory('Github', [ '$resource', 'CONFIG', function ($resource, CONFIG) {
	return $resource(CONFIG.API_BASE_URL + '/api/github/repositories', {id: '@id'});
}]);

hqcode.factory('GithubRepository', [ '$resource', 'CONFIG', function ($resource, CONFIG) {
	return $resource(CONFIG.API_BASE_URL + '/api/github/repository', {id: '@id'});
}]);

hqcode.controller('GithubCtrl', [ '$scope', '$rootScope', '$location', 'GithubSrv', function ($scope, $rootScope, $location, GithubSrv) {
	GithubSrv.getRepos().then(function (repos) {
		$scope.githubRepos = repos;
	}, function (err) {
		alert("Could not load repos, because: " + err.message);
	});

	$scope.activateRepo = function (repoName, shouldActivate) {
		GithubSrv.activateRepo(repoName, shouldActivate).then(function () {
			alert("actiavted");
		}, function (err) {
			alert("Could not activate/diactivate repo, because: " + err.message);
		});
	};
}]);

hqcode.factory('LoginSrv', [ 'Github', 'GithubRepository', 'GithubOAuth', '$http', function (Github, GithubRepository, GithubOAuth, $http) {
	return {
		login: function (token) {
			$http.defaults.headers.common['token'] = token;
			localStorage.setItem('token', token);
		}
	};
}]);

hqcode.factory('GithubSrv', [ 'Github', 'GithubRepository', 'GithubOAuth', '$q', function (Github, GithubRepository, GithubOAuth, $q) {
	return {
		getOAuthInfo: function () {
			return $q(function (resolve, reject) {
				GithubOAuth.get().$promise.then(function (oAuthInfo) {
					resolve(oAuthInfo);
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
		},
		activateRepo: function (repositoryName, shouldActivate) {
			return $q(function (resolve, reject) {
				GithubRepository.save({repositoryName: repositoryName, shouldActivate: shouldActivate}).$promise.then(function (repos) {
					resolve(repos);
				}, function (err) {
					reject(err);
				});
			});
		}
}}]);

hqcode.factory('hqcodeGithub', [ '$resource', function($resource) {
	return $resource('/api/oauth/github');
}]);

hqcode.controller('GithubLoginCtrl', [ '$scope', '$rootScope', '$location', '$http', 'hqcodeGithub', function ($scope, $rootScope, $location, $http, hqcodeGithub) {
	$scope.login = function (token) {
		$http.defaults.headers.common['token'] = token;
		localStorage.setItem('token', token);
	};
}]);
