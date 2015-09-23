angular.module('hqcode').factory('Github', [ '$resource', 'CONFIG', function ($resource, CONFIG) {
	return $resource(CONFIG.API_BASE_URL + '/api/github/repositories', {id: '@id'});
}]);
