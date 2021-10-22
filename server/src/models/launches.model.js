const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');
const launches = new Map()
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = `https://api.spacexdata.com/v4/launches/query`;

/*const launch = {
  flightNumber:100,//flight_number
  mission:"Kepler Exploration X",//name
  rocket:"Explorer IS1",//rocket.name
  launchDate: new Date('December 27,2030'), //date_local
  target:"Kepler-442 b",// not available
  customers:['ZTM','NASA'],//payload.customers
  upcoming:true,//upcoming
  success:true //success
}
saveLaunch(launch);
*/
async function saveLaunch(launch){
  try{
    await launchesDatabase.findOneAndUpdate({
      flightNumber:launch.flightNumber
    },launch,{
      upsert:true
    })
  }catch(e){
    console.log('error in updateOne launch ',e)
  }
}
//launches.set(launch.flightNumber,launch)
async function populateLaunches(){
  console.log("Downloading Launch Data...");
  const response = await axios.post(SPACEX_API_URL,{
    "query": {},
    "options": {
        "pagination":false,
        "populate": [
            {
                "path": "rocket",
                "select": {
                    "name": 1
                }
            },
            {
                "path":"payloads",
                "select":{
                    "customers":1
                }
            }
        ]
    }
  })
  if(response.status!==200){
    console.error('problem geting launch data')
    throw new Error('launch data download failed')
  }
  const launchDocs = response.data.docs;
  for(let launchDoc of launchDocs){
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload)=>{
      return payload['customers'];
    })
    const launch = {
      flightNumber:launchDoc['flight_number'],
      mission:launchDoc['name'],
      rocket:launchDoc['rocket']['name'],
      launchDate:launchDoc['date_local'],
      upcoming:launchDoc['upcoming'],
      success:launchDoc['success'],
      customers
    }
    console.log(`${launch.flightNumber},${launch.mission}`)
      //populate Launches collection
      await saveLaunch(launch);
  }
}

async function loadLaunchData(){
  const firstLaunch = await findLaunch({
    flightNumber:1,
    rocket:'Falcon 1',
    mission:'FalconSat'
  });
  if(firstLaunch){
    console.log('launch data already existed');
    //return;
  }else{
    await populateLaunches()
  }
}

async function findLaunch(filter){
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId){
  return await findLaunch({
    flightNumber:launchId
  })
}

async function getAllLaunches(skip,limit){
  return Array.from(await launchesDatabase.find({},{
    _id:0,
    __v:0
  }).sort({'flightNumber':-1})
  .skip(skip)
  .limit(limit));
}

async function scheduleNewLaunch(launch){
  const planet = await planets.findOne({
    keplerName:launch.target
  })
  if(!planet) throw new Error('No matching Planets found');
  let newFlightNumber = await getLatestFlightNumber();
  const newLaunch = Object.assign(launch,{
    upcoming:true,
    success:true,
    customers:['Zero To Mastery','NASA'],
    flightNumber:newFlightNumber
  })
  saveLaunch(newLaunch);
}

/*function addNewLaunch(launch){
  saveLaunch()
  launches.set(lastFlightNumber,Object.assign(launch,{
    flightNumber:lastFlightNumber,
    customer:['Zero To Mastery','NASA'],
    upcoming:true,
    success:true
  }))
}*/

async function getLatestFlightNumber(){
  let flightNumber = await launchesDatabase.findOne({}).sort('-flightNumber');
  if(!flightNumber.flightNumber){
    return DEFAULT_FLIGHT_NUMBER;
  }
  return flightNumber.flightNumber+1
}

async function abortlaunchById(launchId){
  return await launchesDatabase.updateOne({
    flightNumber:launchId
  },{
    upcoming:false,
    success:false
  });
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  existsLaunchWithId,
  abortlaunchById,
  scheduleNewLaunch
}