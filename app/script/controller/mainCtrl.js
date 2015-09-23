angular.module('hqcode').controller('MainController', [ '$scope', '$rootScope', '$location', 'GithubSrv', 'LoginSrv', function ($scope, $rootScope, $location, GithubSrv, LoginSrv) {
	GithubSrv.getOAuthInfo().then(function (oAuthInfo) {
		$rootScope.githubRedirectUrl = oAuthInfo.githubUrl;
		$rootScope.token = oAuthInfo.token;
	}, function (err) {
		alert("Could not load redirect github url, because: " + err.message);
	});

	$scope.githubLogin = function () {
		if ($rootScope.githubRedirectUrl) {
			LoginSrv.login($rootScope.token);
			window.location.href = $rootScope.githubRedirectUrl;
		}
	};
}]);
