angular.module('authService', [])
	.factory('Auth', function($http, AuthToken){
		var	authFactory = {}
		authFactory.login = function(loginData){
			return $http.post('/api/authenticate', loginData)
				.then(function(data){
					AuthToken.setToken(data.data.token)
					return data
				})
		}
		authFactory.isLoggedIn = function(){
			if(AuthToken.getToken()){
				return true
			} else {
				return false
			}
		}
		authFactory.logout = function(){
			AuthToken.setToken()
		}
		return authFactory
	})
	.factory('AuthToken', function($window){
		var authTokenFactory = {}
		authTokenFactory.setToken = function(token){
			if(token){
				$window.localStorage.setItem('token', token)
			} else {
				$window.localStorage.removeItem('token')
			}
		}
		authTokenFactory.getToken = function(){
			return $window.localStorage.getItem('token')
		}
		return authTokenFactory
	})
