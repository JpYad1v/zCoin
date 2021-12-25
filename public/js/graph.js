//<script>



var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Energy Monitoring',
            data: [],
            backgroundColor:'rgba(225, 78, 202)',
            borderColor: 'rgba(225, 78, 202)',
            borderWidth: 1
        }]
    },
    options: {}
});

  function updateChart() {

  function datafunc() {
    return Math.random();
  }


chart.data.datasets[0].data = [];
chart.data.labels = []

    setInterval(function() {
      data = datafunc();
      timestamp = getDay();
      chart.data.labels.push(timestamp);
      chart.data.datasets[0].data.push(data);
      chart.update();
    }, 3000)

  }

//</script>
