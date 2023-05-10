import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import CancelOutlinedIcon  from "@material-ui/icons/CancelOutlined";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStyles } from "./styles.js";
import DropZone from "../../components/DropZone";
import { api } from "../../services/api";

const CreateNFT = () => {
  const classes = useStyles();
  const history = useHistory();
  const account = useSelector((state) => state.allNft.account);
  const nftList = useSelector((state) => state.allNft.nft);
  const artTokenContract = useSelector(
    (state) => state.allNft.artTokenContract
  );

  const [selectedFile, setSelectedFile] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  function handleInputChange(event) {
    let { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  async function createNFT(event) {
    event.preventDefault();
    
    const { title, description, price } = formData;
    const data = new FormData();
    let tokenId = 0;

    data.append("name", title);
    data.append("description", description);
    data.append("price", price);

    if(selectedFile) {
      data.append('img', selectedFile);
    }

    try {
      const totalSupply = await artTokenContract.methods.totalSupply().call();
      tokenId = Number(totalSupply) + 1
      data.append("tokenId", tokenId);

      const response = await api.post("/tokens", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      });

      mint(response.data.message, tokenId);
    } catch (error) {
      console.log(error);
    }
  }

  async function mint(tokenMetadataURL, tokenId) {
    try {
      await artTokenContract.methods
        .mint(tokenMetadataURL)
        .send({ from: account, gas: '6721975' });
  
      const response = await api
        .get(`/tokens/${tokenId}`)
        .catch((err) => {
          console.log("Err: ", err);
      });

      let item = await artTokenContract.methods.Items(tokenId).call();

      nftList.push({
        name: response.data.name,
        description: response.data.description,
        image: response.data.image,
        tokenId: item.id,
        creator: item.creator,
        owner: account,
        uri: tokenMetadataURL,
        isForSale: false,
        saleId: null,
        price: 0,
        isSold: null,
      });
      
      history.push('/');
    } catch (error) {
      console.error("Error, minting: ", error);
      alert("Error while minting!");
    }
  }

  return (
    <div className={classes.pageCreateNft}>
      <form onSubmit={createNFT}>
        <div className={classes.formHeader}>
          <h1>Create collectible</h1>
          <Link to="/">
            <CancelOutlinedIcon fontSize="large" />
          </Link>
        </div>
        <div className={classes.content}>
          <div className={classes.dropzone}>
            <DropZone onFileUploaded={setSelectedFile} />
          </div>
          <fieldset>
            <TextField
              label="Title"
              name="title"
              variant="filled"
              required
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              label="Description"
              name="description"
              variant="filled"
              required
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="price"
              name="price"
              variant="filled"
              value={formData.price}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
              }}
              fullWidth
            />

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </fieldset>
        </div>
      </form>
    </div>
  );
};

export default CreateNFT;
