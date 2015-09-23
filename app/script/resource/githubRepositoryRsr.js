angular.module('hqcode').factory('GithubRepository', [ '$resource', 'CONFIG', function ($resource, CONFIG) {
	return $resource(CONFIG.API_BASE_URL + '/api/github/repository', {id: '@id'});
}]);
