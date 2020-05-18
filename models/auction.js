const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ], 
  destAdd: {type: String,
           required: true},
    bidding:{type: Boolean,default: false},
    currentprice:{ type: Number, default: 0 }

});

module.exports = mongoose.model('Auction', auctionSchema);
