app.controller('loginCtrl', function($scope, $rootScope, $http, $window) {
  // $rootScope.wActive = 3
  $scope.loginData = { name: null, password: null }
  $scope.errorTexts = { user: null, password: null}
  
  $scope.login = () => {
    // const url = 'http://localhost:3000/login/'
    var req = { method: 'POST', url: 'http://localhost:3000/', headers: {'Content-Type': 'application/json'}, data: $scope.loginData }

    $http(req)
      .then( response => {
        if (response.status === 200) {
          $scope.loginData = { name: null, password: null }
          setUserData(response.data.info)
          window.location.href = 'http://localhost:3000/home'
        }
      })
      .catch(e => {
        switch (e.data.error) {
          case 'password':
            $scope.errorTexts.password = e.data.message
            break;
          case 'user':
            $scope.errorTexts.user = e.data.message
            break;
          default:
            alert('Error en el servidor. Intente de nuevo más tarde.')
        }
      })
  }

  function setUserData(userObj) {
    // $rootScope.user = {
    //   name: userObj.name,
    //   token: null,
    //   email: userObj.email,
    //   firstName: userObj.firstName,
    //   lastName: userObj.lastName,
    //   role: userObj.role
    // }

    sessionStorage.setItem('name', userObj.name)
    sessionStorage.setItem('email', userObj.email)
    sessionStorage.setItem('firstName', userObj.firstName)
    sessionStorage.setItem('lastName', userObj.lastName)
    sessionStorage.setItem('role', userObj.role)
  }

  $scope.userChange = () => {
    $scope.errorTexts = { user: null, password: null }
  }

  $scope.passwordChange = () => {
    $scope.errorTexts = { user: null, password: null }
  }

})