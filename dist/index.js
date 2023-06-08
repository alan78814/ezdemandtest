"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// For parsing application/json
app.use(express_1.default.json());
// For parsing application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'ezdemandtest')));
app.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, '..', filename);
    res.sendFile(filePath);
});
app.get('/test', async (req, res) => {
    try {
        function drawChart(demandData, time) {
            const labels = Object.keys(demandData);
            const data = Object.values(demandData);
            const chartData = {
                labels: labels,
                datasets: [{
                        label: `Demand Data-${(0, dayjs_1.default)(time).format('YYYY-MM-DD')}`,
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
      </html>`;
        }
        let { timeStamp, chartType, deviceName, apiName } = req.query;
        const host = '192.168.0.201';
        const port = 9999;
        const timeStampValue = (0, dayjs_1.default)(timeStamp).valueOf(); // 1651622400000 5/4
        // const chartType = 'day'
        // const deviceName = '(電錶)電盤總電'
        const axiosConfig = {
            timeout: 5000, // 設定 5 秒的超時時間
        };
        const result = await (0, axios_1.default)(`http://${host}:${port}/ezcon/api/${apiName}?timeStamp=${timeStampValue}&chartType=${chartType}&deviceName=${deviceName}`, axiosConfig);
        const demandData = result.data;
        console.log('demandData', demandData);
        const chartHtml = drawChart(demandData, timeStampValue);
        res.setHeader('Content-Type', 'text/html');
        res.write(chartHtml);
        res.end();
    }
    catch (err) {
        console.log(err);
        res.status(500).send(`
    <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <h1>Error</h1>
        <p>Something went wrong. Please try again later.</p>
      </body>
    </html>
  `);
    }
});
app.post('/tonnetTest', (req, res) => {
    console.log('接受通航外拋事件');
    if ((0, dayjs_1.default)(req.body.time).isAfter('2023-05-12 13:35')) {
        console.log('reqbody', req.body);
        console.log('===============================');
    }
    // if (req.body.dev_name === '門口機112' && dayjs(req.body.time).isAfter('2023-05-12 13:35')) {
    //   console.log('reqbody',req.body)
    //   console.log('===============================')
    // } 
    // console.log('reqbody',req.body)
    // console.log('===============================')
});
app.get('/', async (req, res) => {
    res.send(`
    <style>
      body {
        background: linear-gradient(to bottom, #e0f3ff, #a8d4ff); /* 设置背景渐变色 */
        animation: gradientAnimation 5s infinite alternate; /* 应用背景动画效果 */
      }

      @keyframes gradientAnimation {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }
    </style>

    <form action="/test" method="GET">
      <label for="timeStamp">日期:</label>
      <input type="text" id="date" name="timeStamp"><br><br>
      
      <label for="chartType">圖表類型:</label>
      <input type="text" id="chartType" name="chartType"><br><br>
      
      <label for="deviceName">儀器名稱:</label>
      <input type="text" id="deviceName" name="deviceName"><br><br>

      <label for="apiName">api名稱:</label>
      <input type="text" id="apiName" name="apiName"><br><br>
      
      <button type="submit">送出</button>
    </form>
  `);
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=index.js.map