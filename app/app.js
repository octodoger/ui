var hqcode = angular.module('hqcode', ['ngRoute', 'ngResource', 'toggle-switch']);

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

hqcode.controller('MainController', [ '$scope', '$rootScope', '$location', 'GithubSrv', 'LoginSrv', function ($scope, $rootScope, $location, GithubSrv, LoginSrv) {
	GithubSrv.getOAuthInfo().then(function (oAuthInfo) {
		$rootScope.githubRedirectUrl = oAuthInfo.githubUrl;
		LoginSrv.login(oAuthInfo.token);
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

hqcode.factory('GithubRepository', [ '$resource', function($resource) {
	return $resource('/api/github/repository', {id: '@id'});
}]);

hqcode.controller('GithubCtrl', [ '$scope', '$rootScope', '$location', 'GithubSrv', function ($scope, $rootScope, $location, GithubSrv) {
	GithubSrv.getRepos().then(function (repos) {
		$scope.githubRepos = repos;
	}, function (err) {
		alert("Could not load repos, because: " + err.getMessage());
	});

	$scope.activateRepo = function (repoName, shouldActivate) {
		GithubSrv.activateRepo(repoName, shouldActivate).then(function () {
			alert("actiavted");
		}, function (err) {
			alert("Could not activate/diactivate repo, because: " + err.getMessage());
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
	};
}]);
