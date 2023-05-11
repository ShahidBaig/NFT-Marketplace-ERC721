const mongoose = require('mongoose');
const upload = require('../config/uploadConfig');
const nftModel = require('../models/nft');
const nftData = nftModel.nft;

const tokensRoutes = (app) => {
  // INDEX
  app.get('/tokens/:tokenID', async (req, res) => {
    const { tokenID } = req.params;
    const tokens = await nftData.find({ tokenId: tokenID });

    if (tokens.length == 0) {
      return res.status(404).json({});
    }

    res.status(200).json(tokens[0]);
  });

  // CREATE
  app.post('/tokens', upload.single('img'), (req, res) => {
    const { filename } = req.file;
    
    let nft = new nftData(req.body);
    
    nft.image = req.protocol + '://' + req.get('host') + '/images/' + filename;

    nft.save();

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/' +  req.body.tokenId;

    res.status(201).json({ message: fullUrl });
  });
};

module.exports = tokensRoutes;

