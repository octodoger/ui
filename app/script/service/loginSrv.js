angular.module('hqcode').factory('LoginSrv', [ 'Github', 'GithubRepository', 'GithubOAuth', '$http', function (Github, GithubRepository, GithubOAuth, $http) {
    return {
        login: function (token) {
            localStorage.setItem('token', token);
            $http.defaults.headers.common['token'] = token;
        }
    };
}]);
