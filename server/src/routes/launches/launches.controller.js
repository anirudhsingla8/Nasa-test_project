const {getAllLaunches,existsLaunchWithId,abortlaunchById,scheduleNewLaunch} = require('../../models/launches.model');
const {getPagination} = require('../../../services/query');

async function httpGetAllLaunches(req,res){
  try{
    console.log(req.query);
    let {skip,limit} = getPagination(req.query);
    let launches = await getAllLaunches(skip,limit);
    return res.status(200).json(launches);
  }catch(e){
    res.status(400).send('unexpected error');
  }
}

async function httpAddNewLaunch(req,res){
  try{
    let launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
      return res.status(400).json({
        error:"missing required launch property"
      })
    }
    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
      return res.status(400).json({
        error:"invalid Date"
      })
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
  }catch(e){
    res.status(400).json({error:e})
  }
}

async function httpAbortLaunch(req,res){
  let launchId = Number(req.params.id);
  let existLaunch = await existsLaunchWithId(launchId);
  if(!existLaunch){
    return res.status(404).json({
      error:"launch does not exist"
    })
  }
  const aborted = await abortlaunchById(launchId);
  if(aborted.acknowledged == true){
    return res.status(200).json({ok:true});
  }else{
    res.status(400).send('Unexpected error')
  }
  
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}