const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    tokenId: String,
    name: String,
    description: String,
    price: String,
    image: String,
  });

exports.nft = mongoose.model('goerli', nftSchema); 