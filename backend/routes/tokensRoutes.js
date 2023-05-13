const axios = require('axios')
const upload = require('../config/uploadConfig');
const nftModel = require('../models/nft');
// const { IPFSDataClient } = require('../datastore/ipfsclient')
const { Readable } = require("stream");
const config = require('getconfig')
const FormData = require("form-data");

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

    // const ipfsClient = await IPFSDataClient()

    // if (tokens.length == 0) {
    //   return res.status(404).json({});
    // }

    // const cidinfo = await ipfsClient.getCID(tokens[0].image);

    // tokens[0].image = cidinfo.assetGatewayURL;

    // res.status(200).json(tokens[0]);
  });

  // CREATE
  app.post('/tokens', upload.single('img'), async (req, res) => {
    try{
      const { originalname, buffer } = req.file;
      const formData = new FormData();
      const file = Readable.from(buffer);
      // const metadata = JSON.stringify({
      //   name: originalname,
      // });
      // const options = JSON.stringify({
      //   cidVersion: 0,
      // });

      let nft = new nftData(req.body);

      // formData.append('pinataMetadata', metadata);   
      // formData.append('pinataOptions', options);
      formData.append('file', file, {
        filepath: originalname
      });
    
      const postRes = await axios.post(`${config.pinata_pin_url}pinFileToIPFS`, formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${config.pinata_api_jwt}`
        }
      });

      // console.log(postRes.data); //isDuplicate

      nft.image = `${config.pinata_gateway_url}${postRes.data.IpfsHash}`;

      await nft.save();

      res.status(201).json({ message: nft.image });
    } 
    catch (error) {
      console.log(error);
    }

    // const ipfsClient = await IPFSDataClient()
    // let nft = new nftData(req.body);

    // nft.path = originalname;

    // const cid = await ipfsClient.createCIDFromAssetData(buffer, nft)

    // nft.image = cid;

    // await nft.save();

    // res.status(201).json({ message: cid });
  });
};

module.exports = tokensRoutes;

