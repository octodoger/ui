angular.module('hqcode').factory('hqcodeGithub', [ '$resource', function($resource) {
	return $resource('/api/oauth/github');
}]);
