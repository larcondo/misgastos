app.controller('loginCtrl', function($scope, $rootScope, $http, $window) {
  $rootScope.wActive = 3
  $scope.loginData = { name: null, password: null }
  $scope.errorTexts = { user: null, password: null}
  // $scope.errorTexts = { user: 'El usuario no existe', password: 'La contraseña no es correcta'}

  $scope.login = () => {
    const url = 'http://localhost:3000/login/'
    
    $http.post(url, $scope.loginData, 'Content-Type: application/json')
      .then((response) => {
        console.log(response)
        if(response.data.error === 'user') $scope.errorTexts.user = response.data.message
        if(response.data.error === 'password') $scope.errorTexts.password = response.data.message
        if(response.data.error === undefined) {
          // alert(response.data.message)
          setUserData(response.data.info)
          $window.location.href = '#/'
        }
      })
      .catch((e) => console.log(e))

    // console.log($scope.loginData)
  }

  function setUserData(userObj) {
    $rootScope.user = {
      name: userObj.name,
      token: null,
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      role: userObj.role
    }

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