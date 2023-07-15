const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const droneSchema = new mongoose.Schema({
  drone_id: {
    type: String,
    required: true,
  },
  site_id :{
    type:ObjectId,
    ref:"site",
    required:true
  },
  is_Deleted:{
    type:Boolean,
    default: false
  },
  deleted_by: {
    type: String,
    default: '0',
  },
  deleted_on: {
    type: Date,
  },
  drone_type: {
    type: String,
    required: true,
  },
  make_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  missionId:{
    type: ObjectId,
    ref:"mission",    
  }
  
},{timestamps:true});

module.exports = mongoose.model('Drone', droneSchema);