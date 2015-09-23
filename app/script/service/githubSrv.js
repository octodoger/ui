angular.module('hqcode').factory('GithubSrv', [ 'Github', 'GithubRepository', 'GithubOAuth', '$q', '$http', function (Github, GithubRepository, GithubOAuth, $q, $http) {
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
	activateRepo: function (repo) {
		return $q(function (resolve, reject) {
			GithubRepository.save(repo).$promise.then(function (repos) {
				resolve(repos);
			}, function (err) {
				reject(err);
			});
		});
	}
}}]);
