const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transuserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
//   password: {
//     type: String,
//     required: true
//   },
  uid:{
    type: String,
    required: true 
  }

});
module.exports = mongoose.model('Transuser', transuserSchema);