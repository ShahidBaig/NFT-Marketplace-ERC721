require('dotenv').config();
const express = require('express');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://KH_Saif:FqYEzIDpQ7TFTTNp@cluster0.fuxla.mongodb.net/NFT-Marketplace-ERC721?retryWrites=true'); //process.env.ConnectionString);
  console.log('database connected');
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('imgs'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://artnft.netlify.app"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const routes = require('./routes')(app);

const server = app.listen('3333', () => {
  console.log('Listening on port %s...', server.address().port);
});