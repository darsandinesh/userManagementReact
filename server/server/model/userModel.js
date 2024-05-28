const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONODBURL)
  .then(() => console.log('Database Connected!'))
  .catch((e) => console.log('Database is not Connected!!!!', e));


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  mobile:{
    type:Number,
    required:true
  },
  imagePath:{
    type:String,
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model("UserDetails", userSchema);
module.exports = User;
