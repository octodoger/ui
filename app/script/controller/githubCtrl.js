angular.module('hqcode').controller('GithubCtrl', [ '$scope', '$rootScope', '$location', 'GithubSrv', function ($scope, $rootScope, $location, GithubSrv) {
	GithubSrv.getRepos().then(function (repos) {
		$scope.githubRepos = repos;
	}, function (err) {
		alert("Could not load repos, because: " + err.message);
	});

	$scope.activateRepo = function (repoName, shouldActivate) {
		GithubSrv.activateRepo(repoName, shouldActivate).then(function () {
			alert("activated");
		}, function (err) {
			alert("Could not activate/diactivate repo, because: " + err.message);
		});
	};
}]);
