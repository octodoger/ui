angular.module('hqcode').factory('GithubOAuth', [ '$resource', 'CONFIG', function ($resource, CONFIG) {
	return $resource(CONFIG.API_BASE_URL + '/api/oauth', {id: '@id'});
}]);
