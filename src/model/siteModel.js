const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const siteSchema = new mongoose.Schema({
  site_name: {
    type: String,
    required: true,
  },
  userId: {
    type:ObjectId,
    ref : "user"
  },
  position: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
  },
},{timestamps:true});

module.exports  = mongoose.model('Site', siteSchema);