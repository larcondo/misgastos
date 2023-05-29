app.controller('registerCtrl', function($scope, $rootScope, $window, $http) {

  $scope.registerData = {
    name: null, firstName: null, lastName: null, email: null, password: null
  }
  $scope.registerMessages = {
    name: null, firstName: null, lastName: null, email: null, password: null
  }

  $scope.register = () => {
    const valEmail = validarEmail($scope.registerData.email)
    if (valEmail) {
      $scope.registerMessages.email = valEmail
      return
    }
    
    const valName = validarNombreUsuario($scope.registerData.name)
    if (valName !== null) {
      // alert(valName)
      $scope.registerMessages.name = valName
      return
    }

    const valPass = validarPassword($scope.registerData.password)
    if (valPass){
      $scope.registerMessages.password = valPass
      return
    }
    // alert(JSON.stringify($scope.registerData))

    var req = { 
      method: 'POST', 
      url: 'http://localhost:3000/register', 
      headers: 'Content-Type: application/json',
      data: $scope.registerData }

    $http(req)
      .then((response) => {
        console.log(response.status)
        console.log(response)
        if (response.status === 201) {
          alert('Usuario creado')
          $window.location.href = '/'
        }
      })
      .catch((e) => {
        console.log(e.status)
        if (e.status === 400) alert(e.data.error)
      })
  }

  $scope.changeField = ( key ) => {
    $scope.registerMessages[key] = ''
  }

  function validarNombreUsuario( entryName ) {
    var resultado = null
    if( entryName === null || entryName === '') resultado = '¡El nombre de usuario no puede estar vacío!'

    if (!/^(?=.{6,})/.test(entryName)) resultado = 'El usuario debe tener al menos 6 caracteres.'
    
    return resultado
  }

  function validarPassword( entryPassword ) {
    var resultado = null
       
    if ( entryPassword === null || entryPassword === '' ) resultado = '¡El password no puede estar vacío!'

    if (!/^(?=.{8,})/.test(entryPassword)) return resultado = 'La contraseña debe tener al menos 8 caracteres'
    if (!/^(?=.*[A-Z])/.test(entryPassword)) return resultado = 'La contraseña debe tener al menos una Mayúscula'
    if (!/^(?=.*[a-z])/.test(entryPassword)) return resultado = 'La contraseña debe tener al menos una Minúscula'
    if (!/^(?=.*[0-9])/.test(entryPassword)) return resultado = 'La contraseña debe contener al menos un número (0-9)'
    
    return resultado
  }

  function validarEmail( entryEmail ) {
    var resultado = null
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm")

    if (!emailRegex.test(entryEmail)) return resultado = 'El email no es válido'
    
    return resultado
  }

})