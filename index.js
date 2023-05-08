import express from 'express';
import axios from 'axios';
import dayjs from 'dayjs';

const app = express();

app.get('/test', async (req, res) => {
  try {
    function drawChart(demandData,time) {
      const labels = Object.keys(demandData);
      const data = Object.values(demandData);
      
      const chartData = {
        labels: labels,
        datasets: [{
          label: `Demand Data-${dayjs(time).format('YYYY-MM-DD')}`,
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
      
      return `
      <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <div id="chart-container"></div>
          ${canvas + script}
      </body>
    </html>`
    ;
    }
    
    let { timeStamp, chartType, deviceName } = req.query;

    const host = '192.168.0.201'
    const port = 9999
    timeStamp = dayjs(timeStamp).valueOf() // 1651622400000 5/4
    // const chartType = 'day'
    // const deviceName = '(電錶)電盤總電'

    const result = await axios(`http://${host}:${port}/ezcon/api/demandChart?timeStamp=${timeStamp}&chartType=${chartType}&deviceName=${deviceName}`)
    const demandData = result.data;
    console.log('demandData',demandData)

    const chartHtml = drawChart(demandData,timeStamp);
    
    res.setHeader('Content-Type', 'text/html');
    res.write(chartHtml);
    res.end();
  } catch (err) {
    console.log(err)
  }
})

app.get('/', async (req, res) => {
  res.send(`
    <form action="/test" method="GET">
      <label for="timeStamp">日期：</label>
      <input type="text" id="date" name="timeStamp"><br><br>
      
      <label for="chartType">圖表類型：</label>
      <input type="text" id="chartType" name="chartType"><br><br>
      
      <label for="deviceName">儀器名稱：</label>
      <input type="text" id="deviceName" name="deviceName"><br><br>
      
      <button type="submit">送出</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});