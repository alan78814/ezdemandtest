const express = require('express');
const app = express();
const axios = require('axios')
const moment = require('moment')


app.get('/test', async (req, res) => {
  try {
    function drawChart(demandData,time) {
      const labels = Object.keys(demandData);
      const data = Object.values(demandData);
      
      const chartData = {
        labels: labels,
        datasets: [{
          label: `Demand Data-${moment(time).format('YYYY-MM-DD')}`,
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
    
    const host = '192.168.0.201'
    const port = 9999
    const timeStamp = 1651622400000// 5/4
    const chartType = 'day'
    const deviceName = '(電錶)電盤總電'

    const result = await axios(`http://${host}:${port}/ezcon/api/demandChart?timeStamp=${timeStamp}&chartType=${chartType}&deviceName=${deviceName}`)
    const demandData = result.data;
    console.log('demandData',demandData)

    const chartHtml = drawChart(demandData,timeStamp);
  
    const html = 
    `
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <div id="chart-container"></div>
            ${chartHtml}
        </body>
      </html>
    `
    res.setHeader('Content-Type', 'text/html');
    res.write(html);
    res.end();
  } catch (err) {
    console.log(err)
  }
})


app.get('/', async (req, res) => {
  res.send('OK')
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});