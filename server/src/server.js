const http = require('http');
const app = require('./app');
const {startMongo} = require('../services/mongo');
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchData} = require('./models/launches.model');
async function startServer(){
  await startMongo();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT,()=>{
    console.log(`server started on ${PORT}`)
  });
}
startServer();