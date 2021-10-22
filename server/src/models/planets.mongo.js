const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  keplerName:{
    type:String,
    required:true
  }
});
// connects planetSchema with planets Collection
module.exports = mongoose.model('Planet',planetSchema);