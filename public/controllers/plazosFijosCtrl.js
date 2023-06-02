app.controller('plazosFijosCtrl', function($scope, $http, $rootScope) {
  $rootScope.wActive = 2;

  $scope.plazosFijosData = [];
  $scope.totals = { uva: 0, trad: 0 }
  $scope.nuevoPF = {
    tipo: '', plazo: 0, fechaAlta: '', fechaAcred: '', qInicial: '',
    qRecibido: '', intereses: '', activo: ''
  };

  $scope.filtros = { tipo: '', activo: '' };

  $scope.sortOrders = {
    fechaAlta: false, fechaAcred: false, qInicial: false, intereses: false
  }

  $scope.displayModal = { delete: false, update: false, add: false };

  $scope.getPlazosFijos = () => {
    $http.get('http://localhost:3000/plazos-fijos')
    .then(function(response) {
      $scope.plazosFijosData = response.data;
      $scope.backupData = response.data;
      $scope.filtrar();

      const uvas = $scope.plazosFijosData.filter( e => (e.tipo === 'UVA' && e.activo))
      const trad = $scope.plazosFijosData.filter( e => (e.tipo === 'Trad.' && e.activo))
      $scope.totals.uva = uvas.reduce( (acc, cv) => acc + cv.qInicial, 0)
      $scope.totals.trad = trad.reduce( (acc, cv) => acc + cv.qInicial, 0)
    });
    return;
  }

  $scope.getPlazosFijos();

  $scope.guardarPlazoFijo = () => {
    // Validaciones
    if ( $scope.nuevoPF.tipo === "" || $scope.nuevoPF.tipo === null ) { alert('Indicar un tipo de Plazo Fijo'); return;}
    if ( $scope.nuevoPF.fechaAlta === "" || $scope.nuevoPF.fechaAlta === null ) { alert('Indicar una fecha de alta del Plazo Fijo'); return;}
    if ( $scope.nuevoPF.fechaAcred === "" || $scope.nuevoPF.fechaAcred === null ) { alert('Indicar la fecha de acreditación del Plazo Fijo'); return;}
    if ( $scope.nuevoPF.activo === "" || $scope.nuevoPF.activo === null ) { alert('Indicar si el plazo fijo está activo o no'); return;}

    const data = {
      tipo: $scope.nuevoPF.tipo,
      plazo: $scope.nuevoPF.plazo,
      fechaAlta: $scope.nuevoPF.fechaAlta.toISOString().substring(0,10),
      fechaAcred: $scope.nuevoPF.fechaAcred.toISOString().substring(0,10),
      qInicial: $scope.nuevoPF.qInicial,
      qRecibido: $scope.nuevoPF.qRecibido,
      intereses: $scope.nuevoPF.intereses,
      activo: $scope.nuevoPF.activo
    }

    $http.post("http://localhost:3000/plazos-fijos/", data, "Content-Type: application/json")
      .then((response) => {
        $scope.getPlazosFijos();
        $scope.modalAdd(false);
      })
      .catch((error) => console.log(error));

  };

  $scope.actualizarPlazoFijo = () => {
    
    const {_id, ...data} = $scope.pfToUpdate;
    $http.put("http://localhost:3000/plazos-fijos/" + $scope.pfToUpdate._id , data, "Content-Type: application/json" )
    .then((response) => {
      $scope.getPlazosFijos();
    })
    .catch((error) => console.log(error));

    $scope.modalUpdate(false);

  };

  $scope.eliminarPlazoFijo = () => {

    $http.delete("http://localhost:3000/plazos-fijos/" + $scope.pfToDelete._id)
      .then((response) => {
        $scope.getPlazosFijos();
      })
      .catch((error) => console.log(error))

      $scope.modalDelete(false);
  };

  // FUNCIONES GENERALES
  $scope.limpiarCampos = () => {
    $scope.nuevoPF = {
      tipo: "", plazo: 0, fechaAlta: "", fechaAcred: "", qInicial: "0",
      qRecibido: "", intereses: "", activo: ""
    };
  };

  $scope.formatearFecha = (fecha) => {
    return fecha.getFullYear() + '-' + 
      (fecha.getMonth() + 1).toString().padStart(2,'0') + '-' + 
      fecha.getDate().toString().padStart(2,'0');
  }

  $scope.calcularPorcentajeInteres = (interes, monto) => {
    
    // const interes = parseFloat(interesString.replace('.', '').replace(',', '.'));
    // const monto = parseFloat(montoString.replace('.', '').replace(',', '.'));

    return (( interes / monto ) * 100).toFixed(2);
  };

  $scope.formatoDinero = ( valor ) => {
    if (valor === '' || valor === null) { return; };

    return '$ ' + valor;

  };

  $scope.numberToCurrency = ( num ) => {
    return '$ ' + num.toLocaleString('es-AR', {minimumFractionDigits: 2});
  }

  // MODALES
  $scope.modalDelete = function( visible, objeto ) {
    if ( visible ) {
      $scope.displayModal.delete = true;
      $scope.pfToDelete = { ...objeto };
    } else {
      $scope.displayModal.delete = false;
    }
  };

  $scope.modalUpdate = function( visible, objeto ) {
    if ( visible ) {
      $scope.displayModal.update = true;
      $scope.pfToUpdate = { ...objeto };
    } else {
      $scope.displayModal.update = false;
    }
  };

  $scope.modalAdd = function( visible ) {
    if ( visible ) {
      $scope.displayModal.add = true;
    } else {
      $scope.displayModal.add = false;
      $scope.limpiarCampos();
    }
  };

  // FILTROS
  $scope.filtrar = () => {
    const filtrado1 = filtrarPor($scope.backupData, $scope.filtros.tipo, "tipo");
    const filtrado2 = filtrarPor(filtrado1, $scope.filtros.activo, "activo");
    $scope.plazosFijosData = filtrado2;
  };

  function filtrarPor(arreglo, valor, campo) {
    if ( valor !== '' ) {
      const auxiliar = arreglo.filter( (element) => {
        return element[campo] === valor;
      });
      return auxiliar;
    } else {
      return arreglo;
    }
  };

  // ORDENAR
  $scope.ordenarPorFechaAlta = () => {
    $scope.sortOrders.fechaAlta = ordenarPorFecha($scope.plazosFijosData, $scope.sortOrders.fechaAlta, "fechaAlta");
  };

  $scope.ordenarPorFechaAcred = () => {
    $scope.sortOrders.fechaAcred = ordenarPorFecha($scope.plazosFijosData, $scope.sortOrders.fechaAcred, "fechaAcred");
  };

  function ordenarPorFecha(arreglo, orden, campo){
    if (orden) {
      arreglo.sort( function(a,b) {
        let fechaA = new Date(a[campo]);
        let fechaB = new Date(b[campo]);
        if (fechaA < fechaB) { return -1 };
        if (fechaA > fechaB) { return 1 };
        return 0;
      });
    } else {
      arreglo.sort( function(a,b) {
        let fechaA = new Date(a[campo]);
        let fechaB = new Date(b[campo]);
        if (fechaA < fechaB) { return 1 };
        if (fechaA > fechaB) { return -1 };
        return 0;
      });
    }
    return !orden;
  }

  $scope.ordenarPorIntereses = () => {
    $scope.sortOrders.intereses = ordenarPorNumero($scope.plazosFijosData, $scope.sortOrders.intereses, "intereses");
  };

  $scope.ordenarPorMonto = () => {
    $scope.sortOrders.qInicial = ordenarPorNumero($scope.plazosFijosData, $scope.sortOrders.qInicial, "qInicial");
  };

  function ordenarPorNumero(arreglo, orden, campo){
    if ( orden ) {
      arreglo.sort( function(a,b) {
        // Cambio de "." por "," ya que parseFloat considera separador decimal al "."
        // let numA = (a[campo] === '') ? 0 : parseFloat(a[campo].replace('.','').replace(',','.'));
        // let numB = (b[campo] === '') ? 0 : parseFloat(b[campo].replace('.','').replace(',','.'));
        // return numA - numB;
        return a[campo] - b[campo];
      })
    } else {
      arreglo.sort( function(a,b) {
        // Cambio de "." por "," ya que parseFloat considera separador decimal al "."
        // let numA = (a[campo] === '') ? 0 : parseFloat(a[campo].replace('.','').replace(',','.'));
        // let numB = (b[campo] === '') ? 0 : parseFloat(b[campo].replace('.','').replace(',','.'));
        return b[campo] - a[campo];
      })
    }
    return !orden;
  };

});