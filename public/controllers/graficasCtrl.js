app.controller('graficasCtrl', function($scope, $rootScope, $http, $window){
  $rootScope.wActive = 6

  $scope.pagosData = []
  $scope.tipos = []
  $scope.detalles = []
  $scope.barData = []
  $scope.pieData = []
  $scope.pieFilters = []
  $scope.pieMeses = []
  $scope.pieActFilter = {
    year: null, month: null
  }

  $scope.grafico = null
  $scope.graficoPie = null

  $scope.getPagos = () => {
    if ($rootScope.user.name === null || $rootScope.user.name === undefined) return
    var req = { method: 'GET', url: 'http://localhost:3000/pagos', headers: { 'Authorization': $rootScope.user.name } }
    $http(req)
    .then(function(response) {
      if (response.status === 200) {
        $scope.pagosData = response.data;
        // $scope.backupData = response.data;
        $scope.pagosData.forEach( element => {
          if (!$scope.tipos.includes(element.tipo)) $scope.tipos.push(element.tipo)
          if (!$scope.detalles.includes(element.detalle) && element.tipo === 'pago') $scope.detalles.push(element.detalle)

          if (element.tipo !== 'pago') return

          const sYear = element.fecha.substr(0,4)
          const sMonth = element.fecha.substr(5,2)

          if ($scope.pieFilters.some( e => e.year === sYear)) {
            const indice = $scope.pieFilters.findIndex( e => e.year === sYear)
            if(!$scope.pieFilters[indice].meses.includes(sMonth)) $scope.pieFilters[indice].meses.push(sMonth)
          } else {
            $scope.pieFilters.push({ year: sYear, meses: [sMonth]})
          }

          return
        });

        $scope.pieFilters.sort((a,b) => a.year - b.year);
        console.log($scope.pieFilters)

        $scope.pieMeses = $scope.pieFilters[0].meses

        $scope.pieData = $scope.pagosData.filter( element => {
          return element.fecha.substr(5,2) === '05' && element.tipo === 'pago'
        })
        // console.log(pieData)
        $scope.pieData.sort((a, b) => {return b.importe - a.importe})
        $scope.pieActFilter.year = '2023'
        $scope.pieActFilter.month = '05'

        // Ordeno los detalles alfabeticamente
        $scope.detalles.sort();

        const aux = $scope.pagosData.filter( e => e.detalle === $scope.detalles[0])

        aux.sort( (a, b) => {
          const dA = new Date(a.fecha)
          const dB = new Date(b.fecha)
          return dA - dB
        })

        let i;
        for(i = 0; i < aux.length; i++) {
          let porcentaje = 0.00
          if (i > 0) {
            porcentaje = calcularPorcentajeAumento(aux[i].importe, aux[i-1].importe)
          }
          $scope.barData.push({
            fecha: aux[i].fecha,
            importe: aux[i].importe,
            diff: porcentaje
          })
        }

        $scope.initChart($scope.barData, $scope.detalles[0])
        initPieChart($scope.pieData, "Mes de Mayo")
      }
    })
    .catch((response) => {
      console.log(response)
      console.log(response.data.error)
    });

    return;
  }

  $scope.getPagos();

  $scope.initChart = (dataArray, titulo) => {
    const barColor = "#454599"

    const dataArraySorted = dataArray.sort( (a, b) => {
      const dA = new Date(a.fecha)
      const dB = new Date(b.fecha)
      return dA - dB
    })

    const ejeX = dataArraySorted.map( e => e.fecha )
    const ejeY = dataArraySorted.map( e => e.importe )

    const datos = {
      labels: ejeX,
      datasets: [{
        data: ejeY,
        label: 'Label',
        backgroundColor: barColor
      }]  
    }
    
    const config = {
      type: 'bar',
      data: datos,
      options: {
        title: {
          display: true,
          text: titulo
        },
        legend: {
          display: false,
          position: 'top',
          labels: {
            fontColor: 'red'
          }
        },
        scales: {
          xAxes: [{
            // barThickness: 20,
            barPercentage: 0.5,
            gridLines: {
              display: false
            },
            ticks: {
              fontSize: 10
            },
            scaleLabel: {
              display: true,
              labelString: 'Fecha',
              // fontColor: 'red',
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Importe',
              // fontColor: 'red',
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return '$ ' + value
              }
            }
          }]
        }
      }
    }

    $scope.grafico = new Chart("myChart", config)
  }

  $scope.refreshChart = (dataArray, titulo) => {
    
    const dataArraySorted = dataArray.sort( (a, b) => {
      const dA = new Date(a.fecha)
      const dB = new Date(b.fecha)
      return dA - dB
    })

    const ejeX = dataArraySorted.map( e => e.fecha )
    const ejeY = dataArraySorted.map( e => e.importe )

    $scope.grafico.data.labels = []
    $scope.grafico.data.datasets[0].data = []
    $scope.grafico.data.labels = ejeX
    $scope.grafico.data.datasets[0].data = ejeY
    $scope.grafico.options.title.text = titulo
    $scope.grafico.update();
  }

  $scope.changeBarData = (detalle) => {
    
    $scope.barData = []

    $scope.pagosData.forEach( element => {
      if (element.detalle === detalle) {
        $scope.barData.push({
          fecha: element.fecha,
          importe: element.importe
        })
      }
    })

    $scope.barData.sort( (a, b) => {
      const dA = new Date(a.fecha)
      const dB = new Date(b.fecha)
      return dA - dB
    })

    let i;
    for(i = 0; i < $scope.barData.length; i++) {
      let porcentaje = 0.00
      if (i > 0) {
        porcentaje = calcularPorcentajeAumento($scope.barData[i].importe, $scope.barData[i-1].importe)
      }
      $scope.barData[i] = {...$scope.barData[i], diff: porcentaje}
    }

    $scope.refreshChart($scope.barData, detalle)

  }

  $scope.changeYear = (year) => {
    
    const aux = $scope.pieFilters.filter(e => e.year === year)
    if(aux.length === 1) {
      $scope.pieMeses = aux[0].meses.sort()
    } else {
      alert('Error al obtener los meses para el Pie Chart')
    }
  }

  $scope.getMonthString = (month) => {
    const MONTHS = [
      'Enero', 'Febrero',
      'Marzo', 'Abril',
      'Mayo', 'Junio',
      'Julio', 'Agosto',
      'Septiembre', 'Octubre',
      'Noviembre', 'Diciembre'
    ]

    return MONTHS[month-1]
  }

  $scope.updatePieChart = () => {
    if (!$scope.pieActFilter.month) return
    
    $scope.pieData = $scope.pagosData.filter( element => {
      const m = element.fecha.substr(5,2)
      const y = element.fecha.substr(0,4)

      return element.tipo === 'pago' && y === $scope.pieActFilter.year && m === $scope.pieActFilter.month
    })
    // console.log(pieData)
    $scope.pieData.sort((a, b) => {return b.importe - a.importe})

    refreshPieChart($scope.pieData, $scope.getMonthString($scope.pieActFilter.month) + ' de ' + $scope.pieActFilter.year)
  }

  function initPieChart(dataArray, titulo) {
    let pieColors = []
    let i;
    for(i = 0; i < dataArray.length; i++) {
      // pieColors.push('hsl(240, 38%, ' + (i * 10 + 25) + '%)')
      pieColors.push('hsl(240, 38%, ' + ((i+1) / (dataArray.length+1))*100 + '%)')
    }

    console.log(pieColors)

    const datos = {
      labels: dataArray.map( e => e.detalle ),
      datasets: [{
        label: 'hola',
        data: dataArray.map( e => e.importe ),
        backgroundColor: pieColors,
        borderWidth: 0,
        borderColor: 'black'
      }]
    }

    const config = {
      type: 'doughnut',
      // type: 'pie',
      data: datos,
      options: {
        title: {
          display: true,
          text: titulo
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10,
            fontColor: "black",
            padding: 10
          }
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function(tooltipItem, data) {
              // var label = 'Index: ' + tooltipItem.index;
              var label = data.labels[tooltipItem.index];
              
              return label;
            },
            afterLabel: function(tooltipItem, data) {
              // var label = 'Index: ' + tooltipItem.index;
              // var label = '% ' + 100;
              var label = '$ ' + data.datasets[0].data[tooltipItem.index];
              return label;
            },
            afterBody: function(tooltipItem, data) {
              var label = tooltipItem.index;

              return label;
            }
          }
        },
        plugins: {
          datalabels: {
            color: '#ccc',
            anchor: 'end',
            align: 'start',
            offset: 10,
            font: {
              size: 10
            },
            formatter: (value, ctx) => {
    
              let total = 0
              ctx.dataset.data.map ( e => {
                total += e
              })
            
              let percentage = Math.round((value / total) * 100) + '%';
    
              return percentage
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    }

    // var ctx = document.getElementById("pieChart").getContext('2d');
    $scope.graficoPie = new Chart("pieChart", config)

  }

  function refreshPieChart(dataArray, titulo) {

    let pieColors = []
    let i;
    for(i = 0; i < dataArray.length; i++) {
      pieColors.push('hsl(240, 38%, ' + ((i+1) / (dataArray.length+1))*100 + '%)')
    }

    $scope.graficoPie.data.datasets[0].backgroundColor = pieColors

    $scope.graficoPie.data.labels = []
    $scope.graficoPie.data.datasets[0].data = []
    $scope.graficoPie.data.labels = dataArray.map(e => e.detalle)
    $scope.graficoPie.data.datasets[0].data = dataArray.map(e => e.importe)
    $scope.graficoPie.options.title.text = titulo
    $scope.graficoPie.update();
  }

  function calcularPorcentajeAumento(datoActual, datoAnterior) {
    let diff = 0
    let porcentaje = 0
    diff = datoActual - datoAnterior
    porcentaje = (diff * 100) / datoAnterior
    porcentaje = porcentaje.toFixed(2)
    porcentaje = (porcentaje > 0.01 || porcentaje < -0.01) ? porcentaje : 0.00
    return porcentaje
  }

})