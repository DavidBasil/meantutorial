angular.module('userController', ['userService'])
	.controller('regCtrl', function($http, $location, $timeout, User){
		var app = this
		this.regUser = function(regData, valid){
			app.loading = true
			app.errorMsg = false
			if (valid){
				User.create(app.regData)
					.then(function(data){
						if(data.data.success){
							app.loading = false
							app.successMsg = data.data.message + '...redirecting'
							$timeout(function(){
								$location.path('/')
							}, 2000)
						} else {
							app.loading = false
							app.errorMsg = data.data.message
						}
					})
			} else {
				app.loading = false
				app.errorMsg = "Please ensure the form is filled properly"
			}
		}
	})
	.controller('facebookCtrl', function($routeParams, Auth, $location, $window){
		var app = this
		if ($window.location.pathname == '/facebookerror'){
			app.errorMsg = 'Facebook email not found in database'
		} else {
			Auth.facebook($routeParams.token)
			$location.path('/')
		}
	})
	.controller('twitterCtrl', function($routeParams, Auth, $location, $window){
		var app = this
		if ($window.location.pathname == '/facebookerror'){
			app.errorMsg = 'Twitter email not found in database'
		} else {
			Auth.facebook($routeParams.token)
			$location.path('/')
		}
	})
	.controller('googleCtrl', function($routeParams, Auth, $location, $window){
		var app = this
		if ($window.location.pathname == '/googleerror'){
			app.errorMsg = 'Google email not found in database'
		} else {
			Auth.facebook($routeParams.token)
			$location.path('/')
		}
	})
