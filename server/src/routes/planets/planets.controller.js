const {getAllPlanets} = require('../../models/planets.model');

async function httpGetAllPlanets(req,res){
  try{
    return res.status(200).json(await getAllPlanets());
  }catch(e){
    return res.status(400).send('unexpected error');
  }
}

module.exports = {
  httpGetAllPlanets
}