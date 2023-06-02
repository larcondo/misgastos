app.controller('configCtrl', function($scope, $rootScope, $http, $window) {
  $rootScope.wActive = 4
  $scope.newFirstName = ''
  $scope.newLastName = ''
  $scope.newEmail = ''
  $scope.password = ''

  $scope.displayModal = {
    fname: false,
    lname: false,
    email: false
  }

  $scope.modalConfigFName = ( visible ) => {
    if (visible) {
      $scope.displayModal.fname = true;
    } else {
      $scope.displayModal.fname = false;
    }
  }

  $scope.modalConfigLName = ( visible ) => {
    if (visible) {
      $scope.displayModal.lname = true;
    } else {
      $scope.displayModal.lname = false;
    }
  }

  $scope.modalConfigEmail = ( visible ) => {
    if (visible) {
      $scope.displayModal.email = true;
    } else {
      $scope.displayModal.email = false;
    }
  }

  $scope.actualizarFName = () => {
    
    data = { userName: $rootScope.user.name, firstName: $scope.newFirstName }

    var req = { 
      method: 'POST', url: 'http://localhost:3000/config/firstName/', 
      headers: {
        'Authorization': 'BEARER ' + $scope.password,
        'Content-Type': 'application/json'
      }, 
      data: data 
    }
    
    $http(req)
      .then((response) => {
        if (response.status === 200) {
          $rootScope.user.firstName = $scope.newFirstName
          borrarCampos();
        } 
      })
      .catch(e => {
        alert(e.data.message)
        borrarCampos();
      })

    // Se cierra el modal
    $scope.modalConfigFName(false)
  }

  $scope.actualizarLName = () => {

    data = { userName: $rootScope.user.name, lastName: $scope.newLastName }

    var req = { 
      method: 'POST', url: 'http://localhost:3000/config/lastName/', 
      headers: {
        'Authorization': 'BEARER ' + $scope.password,
        'Content-Type': 'application/json'
      }, 
      data: data 
    }

    $http(req)
      .then((response) => {
        if (response.status === 200) {
          $rootScope.user.lastName = $scope.newLastName
          borrarCampos();
        }
      })
      .catch(e => {
        alert(e.data.message)
        borrarCampos();
      })

    // Se cierra el modal
    $scope.modalConfigLName(false)
  }

  $scope.actualizarEmail = () => {
    
    data = { userName: $rootScope.user.name, email: $scope.newEmail }
    
    var req = { 
      method: 'POST', url: 'http://localhost:3000/config/email/', 
      headers: {
        'Authorization': 'BEARER ' + $scope.password,
        'Content-Type': 'application/json'
      }, 
      data: data 
    }

    $http(req)
      .then((response) => {
        if (response.status === 200) {
          $rootScope.user.email = $scope.newEmail
          borrarCampos();
        } 
      })
      .catch(e => {
        alert(e.data.message)
        borrarCampos();
      })
    
    // Se cierra el modal
    $scope.modalConfigEmail(false)
  }

  function borrarCampos() {
    $scope.password = null;
    $scope.newFirstName = null;
    $scope.newLastName = null;
    $scope.newEmail = null;
  }

  $scope.logout = () => {

    const req = {
      method: 'DELETE',
      url: 'http://localhost:3000/logout',
      headers: {'Content-Type': 'application/json'},
      data: $rootScope.user
    }
    
    $http(req)
    .then( response => {
      console.log(response)
      if (response.status === 200) {
        for (let key in $rootScope.user) {
          $rootScope.user[key] = null
        }
        sessionStorage.clear()
        $window.location.href = '/'
      }
    })
    .catch( error => {
      console.log(error)
      alert(error.status + ' - Error: ' + error.data.message)
    })    
  }


})