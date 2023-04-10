app.controller('logoutCtrl', function($scope, $rootScope, $http, $window) {
  $rootScope.wActive = 5

  $scope.logout = () => {
    for (let key in $rootScope.user) {
      $rootScope.user[key] = null
    }
    sessionStorage.clear()
    $window.location.href = '#!login'
  }
})