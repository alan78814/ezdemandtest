const Chart = require('chart.js');

function drawChart(demandData) {
  const labels = Object.keys(demandData);
  const data = Object.values(demandData);
  
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Demand Data',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: data,
    }]
  };
  
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  
  const canvas = '<canvas id="myChart"></canvas>';
  const script = `
    <script>
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, ${JSON.stringify(config)});
    </script>
  `;
  
  return canvas + script;
}
