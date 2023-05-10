const mongoose = require('mongoose');
const uri = 'mongodb+srv://KH_Saif:FqYEzIDpQ7TFTTNp@cluster0.fuxla.mongodb.net/NFT-Marketplace-ERC721?retryWrites=true&w=majority';
const upload = require('../config/uploadConfig');

const tokensRoutes = (app) => {
  mongoose.connect(uri);

  const nftSchema = new mongoose.Schema({
    tokenId: String,
    name: String,
    description: String,
    price: String,
    image: String,
  });

  const nftSave = mongoose.model('NFT', nftSchema);

  // INDEX
  app.get('/tokens/:tokenID', (req, res) => {
    const { tokenID } = req.params;

    res.status(200).json(tokens[tokenID]);
  });

  // CREATE
  app.post('/tokens', upload.single('img'), async (req, res) => {
    const { filename } = req.file;
    const { tokenId, name, description, price } = req.body;

    let nft = new nftSave();
    
    nft.tokenId = tokenId;
    nft.name = name;
    nft.description = description;
    nft.price = price;
    nft.image = req.protocol + '://' + req.get('host') + '/images/' + filename;

    await nft.save();

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + tokenId;

    res.status(201).json({ message: fullUrl });
  });
};

module.exports = tokensRoutes;

