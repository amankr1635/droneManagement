const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  tag_name: {
    type: String,
    required: true,
  },
},{timestamps:true});

module.exports = mongoose.model('Category', categorySchema);