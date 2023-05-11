require('dotenv').config();
const express = require('express');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.ConnectionString);
  console.log('database connected');
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('imgs'));
const routes = require('./routes')(app);

const server = app.listen('3333', () => {
  console.log('Listening on port %s...', server.address().port);
});