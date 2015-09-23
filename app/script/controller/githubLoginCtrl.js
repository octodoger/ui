angular.module('hqcode').controller('GithubLoginCtrl', [ '$scope', '$rootScope', '$location', '$http', 'hqcodeGithub', function ($scope, $rootScope, $location, $http, hqcodeGithub) {
	$scope.login = function (token) {
		$http.defaults.headers.common['token'] = token;
		localStorage.setItem('token', token);
	};
}]);
