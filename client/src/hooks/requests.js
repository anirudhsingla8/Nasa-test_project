const API_URL = "http://localhost:8000/v1";

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const fetchLaunches = await response.json();
  return fetchLaunches.sort((a,b)=>{
    return a.flightNumber-b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  try{
    return await fetch(`${API_URL}/launches`,{
      method:"post",
      headers:{
        "Content-Type":"application/JSON"
      },
      body: JSON.stringify(launch)
    })
  }catch(e){
    return {
      ok:false
    }
  }
}

async function httpAbortLaunch(id) {
  try{
    return await fetch(`${API_URL}/launches/${id}`,{
      method:"delete"
    })
  }catch(e){
    return {
      ok:false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};