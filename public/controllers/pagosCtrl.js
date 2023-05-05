app.controller('pagosCtrl', function($scope, $http, $rootScope) {
  $rootScope.wActive = 1;

  $scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  $scope.years = ['2022', '2023'];

  $scope.sortOrders = {
    fecha: false, importe: false
  }
  $scope.pagosData = [];
  $scope.nuevoPago = { tipo: '', fecha: '', detalle: "", importe: 0, vencimiento: '', observaciones: '' };
  $scope.tempPago = {};

  $scope.sumaImporte = 0;

  $scope.filtros = { 
    tipo: '', 
    detalle: '', 
    observaciones: '', 
    year: null, 
    month: null 
  }

  $scope.filtroDetalle = [];
  $scope.filtroTipo = [];
  $scope.displayModal = { add: false, delete: false, update: false };

  $scope.getPagos = () => {
    if ($rootScope.user.name === null || $rootScope.user.name === undefined) return
    var req = { method: 'GET', url: 'http://localhost:3000/pagos', headers: { 'Authorization': $rootScope.user.name } }
    $http(req)
    .then(function(response) {
      if (response.status === 200) {
        $scope.pagosData = response.data;
        $scope.backupData = response.data;
        $scope.filtroDetalle = [];
        $scope.filtroTipo = [];
        $scope.pagosData.forEach( (element) => {
          if (!$scope.filtroDetalle.includes(element.detalle)) { $scope.filtroDetalle.push(element.detalle)};
          if (!$scope.filtroTipo.includes(element.tipo)) { $scope.filtroTipo.push(element.tipo)};
          return;
        })
        $scope.filtroDetalle.unshift('');
        $scope.filtroTipo.unshift('');
        $scope.filtrar();

        $scope.sumaImporte = sumarImportes( $scope.pagosData );
    
      }
    })
    .catch((response) => {
      console.log(response)
      console.log(response.data.error)
    });

    return;
  }      

  $scope.getPagos();

  $scope.guardarPago = () => {

    if (verificarSiVacio($scope.nuevoPago.tipo, 'Debe especificar un tipo de pago.')) { return; }
    if (verificarSiVacio($scope.nuevoPago.fecha, 'Debe especificar una fecha para el pago.')) { return; }
    if (verificarSiVacio($scope.nuevoPago.detalle, 'Indique el detalle del pago.')) { return; }
    if (verificarSiVacio($scope.nuevoPago.vencimiento, 
      'Debe especificar una fecha de vencimiento para el pago.' + 
      'Si el pago no tiene vencimiento, ponga la fecha del pago.')) { return; }

    const data = {
        tipo: $scope.nuevoPago.tipo,
        fecha: $scope.nuevoPago.fecha.toISOString().substring(0,10),
        detalle: $scope.nuevoPago.detalle,
        importe: $scope.nuevoPago.importe,
        vencimiento: $scope.nuevoPago.vencimiento.toISOString().substring(0,10),
        observaciones: $scope.nuevoPago.observaciones,
        user: $rootScope.user.name
      }

    var req = { method: 'POST', url: 'http://localhost:3000/pagos/', headers: {'Content-Type': 'application/json'}, data: data }
    
    $http(req)
      .then((response) => {
        console.log(response);
        $scope.getPagos();
        $scope.modalAdd(false);
      })
      .catch((error) => console.log(error));
    
  };

  $scope.eliminarPago = (id) => {
    // console.log('Se eliminará el pago con id: ' + id);
    var req = { method: 'DELETE', url: 'http://localhost:3000/pagos/' + id }
    // $http.delete("http://localhost:3000/pagos/"+id)
    $http(req)
      .then((response) => {
        console.log(response);
        $scope.getPagos();        
        $scope.modalDelete(false);
      })
      .catch((error) => console.log(error))
    
  }

  $scope.actualizarPago = (id) => {
    
    // Destructuring
    // const {_id, ...data} = $scope.tempPago;
    let {_id, ...data} = $scope.tempPago;
    
    data.fecha = $scope.tempPago_fecha.toISOString().substring(0,10);
    
    var req = { method: 'PUT', url: 'http://localhost:3000/pagos/' + $scope.tempPago._id,
      headers: {'Content-Type': 'application/json'}, data: data }

    $http(req)
      .then((response) => {
        $scope.getPagos();
      })
      .catch((error) => console.log(error));

    $scope.modalUpdate(false);
  }

  // MODALES
  $scope.modalDelete = ( visible, id) => {
    if (visible) {
      $scope.index = $scope.pagosData.findIndex( element => element._id === id );
      $scope.displayModal.delete = true;
    } else {
      $scope.displayModal.delete = false;  
    }
  }

  $scope.modalUpdate = ( visible, id ) => {
    if (visible) {
      $scope.index = $scope.pagosData.findIndex( element => element._id === id );
      $scope.tempPago = {...$scope.pagosData[$scope.index]};
      $scope.tempPago_fecha = new Date($scope.pagosData[$scope.index].fecha + "T03:00:00.000");
      $scope.displayModal.update = true;
    } else {
      $scope.displayModal.update = false;  
    }
  }

  $scope.modalAdd = ( visible ) => {
    if (visible) {
      $scope.displayModal.add = true;
    } else {
      $scope.displayModal.add = false;
      $scope.limpiarCampos();
    }
  }

  // FUNCIONES GENERALES
  $scope.formatearFecha = (fecha) => {
    return fecha.getFullYear() + '-' + 
      (fecha.getMonth() + 1).toString().padStart(2,'0') + '-' + 
      fecha.getDate().toString().padStart(2,'0');
  }

  $scope.limpiarCampos = () => {
    $scope.nuevoPago = { tipo: "", fecha: "", detalle: "", importe: 0, vencimiento: "", observaciones: "" };
  }

  $scope.numberToCurrency = ( num ) => {
    return '$ ' + num.toLocaleString('es-AR', {minimumFractionDigits: 2});
  }

  function verificarSiVacio( variable, mensaje ) {
    if (variable === '' || variable === null || variable === undefined) {
      alert(mensaje);
      return true;
    }
    return false;
  }

  function sumarImportes ( array ) {
    return array.reduce((total, value) => { 
      return total + value.importe;
    }, 0.00);
  }
  

  // ORDENAR
  $scope.ordenarPorFecha = () => {
    
    if ($scope.sortOrders.fecha) {
        $scope.pagosData.sort( function(a, b) {
          let fechaA = new Date(a.fecha);
          let fechaB = new Date(b.fecha);
          
          if (fechaA < fechaB) {return -1};
          if (fechaA > fechaB) {return 1};
          return 0;
        });    
        $scope.sortOrders.fecha = false;
      } else {
        $scope.pagosData.sort( function(a, b) {
          let fechaA = new Date(a.fecha);
          let fechaB = new Date(b.fecha);
          
          if (fechaA < fechaB) {return 1};
          if (fechaA > fechaB) {return -1};
          return 0;
        });
        $scope.sortOrders.fecha = true;
      };
  }

  $scope.ordenarPorImporte = () => {
    if ($scope.sortOrders.importe) {
      $scope.pagosData.sort( function(a,b) {
        return a.importe - b.importe;
      });
      $scope.sortOrders.importe = false;
    } else {
      $scope.pagosData.sort( function(a,b) {
        return b.importe - a.importe;
      });
      $scope.sortOrders.importe = true;
    }
  }

  
  // FILTROS
  $scope.filtrar = () => {
    
    const filtrado1 = filtrarPor($scope.backupData, $scope.filtros.tipo, "tipo");
    const filtrado2 = filtrarPor(filtrado1, $scope.filtros.detalle, "detalle");
    const filtrado3 = filtrado2.filter((element) => {
      return element.observaciones.toLowerCase().includes($scope.filtros.observaciones.toLowerCase());
    });

    let filtrado4 = filtrado3;

    if ($scope.filtros.year) {
      filtrado4 = filtrado3.filter( element => {
        return element.fecha.substring(0, 4) === $scope.filtros.year;
      })
    }
    let filtrado5 = filtrado4

    if ($scope.filtros.month) {
      filtrado5 = filtrado4.filter( element => {
        return element.fecha.substring(5,7) === $scope.filtros.month;
      })
    }

    $scope.pagosData = filtrado5;

    $scope.sumaImporte = sumarImportes( $scope.pagosData );
  };

  function filtrarPor( arreglo, valor, propiedad) {
    if ( valor !== '' ) {
      const auxiliar = arreglo.filter( (element) => {
        return element[propiedad] === valor;
      });
      return auxiliar;
    } else {
      return arreglo;
    }
  }

});