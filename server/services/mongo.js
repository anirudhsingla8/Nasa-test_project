const mongoose = require('mongoose');
const MONGO_URL = `mongodb+srv://nasa-api:rj13sl1608@cluster0.lcda6.mongodb.net/nasa?retryWrites=true&w=majority`;

mongoose.connection.once('open',()=>{
  console.log('successfully connected mongo');
});
mongoose.connection.on('error',(err)=>{
  console.error(err);
})

async function startMongo(){
  await mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
  })
}

async function disconnectMongo(){
  await mongoose.disconnect();
}

module.exports = {
  startMongo,
  disconnectMongo
};