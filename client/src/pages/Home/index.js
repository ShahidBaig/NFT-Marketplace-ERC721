import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import ReactPaginate from 'react-paginate';

import getWeb3 from "../../utils/getWeb3";
import { api } from "../../services/api";

import ArtMarketplace from "../../contracts/ArtMarketplace.json";
import ArtToken from "../../contracts/ArtToken.json";

import {
  setNft,
  setAccount,
  setTokenContract,
  setMarketContract,
} from "../../redux/actions/nftActions";
import Card from "../../components/Card";

import { useStyles } from "./styles.js";

import veterans from "../../assets/arts/Sparse-Ahmed-Mostafa-vetarans-2.jpg";
import lionKing from "../../assets/arts/suresh-pydikondala-lion.jpg";
import dreaming from "../../assets/arts/phuongvp-maybe-i-m-dreaming-by-pvpgk-deggyli.jpg";
import modeling3d from "../../assets/arts/alan-linssen-alanlinssen-kitbashkitrender2.jpg";
import woman from "../../assets/arts/ashline-sketch-brushes-3-2.jpg";
import stones from "../../assets/arts/rentao_-22-10-.jpg";
import wale from "../../assets/arts/luzhan-liu-1-1500.jpg";
import comic from "../../assets/arts/daniel-taylor-black-and-white-2019-2.jpg";
import galerie from "../../assets/galerie.svg";

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const nftAllList = useSelector((state) => state.allNft.nft);
	const [currentPage, setCurrentPage] = React.useState(1);
  const [cardsPerPage] = React.useState(8);
 
	const indexOfLastCard = currentPage * cardsPerPage;
	const indexOfFirstCard = indexOfLastCard - cardsPerPage;
	const nftList = nftAllList.slice(indexOfFirstCard, indexOfLastCard);

  useEffect(() => {
    const init = async () => {
      try {
        let itemsList = [];
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
  
        if (typeof accounts === undefined) {
          alert("Please login with Metamask!");
          console.log("login to metamask");
        }
  
        const networkId = await web3.eth.net.getId();
        try {
          const artTokenContract = new web3.eth.Contract(
            ArtToken.abi,
            ArtToken.networks[networkId].address
          );
          const marketplaceContract = new web3.eth.Contract(
            ArtMarketplace.abi,
            ArtMarketplace.networks[networkId].address
          );
          const totalSupply = await artTokenContract.methods
            .totalSupply()
            .call();
          const totalItemsForSale = await marketplaceContract.methods
            .totalItemsForSale()
            .call();
  
          dispatch(setAccount(accounts[0]));
          dispatch(setTokenContract(artTokenContract));
          dispatch(setMarketContract(marketplaceContract));
    
          for (var tokenId = totalSupply; tokenId >= 1; tokenId--) {
            let item = await artTokenContract.methods.Items(tokenId).call();
            let owner = await artTokenContract.methods.ownerOf(tokenId).call();
  
            // const response = await api
            //   .get(`/tokens/${tokenId}`)
            //   .catch((err) => {
            //     console.log("Err: ", err);
            //   });
            try {
              const response = JSON.parse(item.uri);
  
              itemsList.push({
                name: response.name,
                description: response.description,
                image: response.tokenMetadataURL,
                tokenId: item.id,
                creator: item.creator,
                owner: owner,
                uri: response,
                isForSale: false,
                saleId: null,
                price: 0,
                isSold: null,
              });
            }
            catch (e) {
              console.error("Error", e);

              itemsList.push({
                name: 'MISSING',
                description: 'MISSING',
                image: item.uri,
                tokenId: tokenId,
                creator: '',
                owner: owner,
                uri: item.uri,
                isForSale: false,
                saleId: null,
                price: 0,
                isSold: null,
              });
            }
          }

          if (totalItemsForSale > 0) {
            for (var saleId = 0; saleId < totalItemsForSale; saleId++) {
              let item = await marketplaceContract.methods
                .itemsForSale(saleId)
                .call();
              let active = await marketplaceContract.methods
                .activeItems(item.tokenId)
                .call();
  
              let itemListIndex = itemsList.findIndex(
                (i) => i.tokenId === item.tokenId
              );
  
              itemsList[itemListIndex] = {
                ...itemsList[itemListIndex],
                isForSale: active,
                saleId: item.id,
                price: item.price,
                isSold: item.isSold,
              };
            }
          }

          dispatch(setNft(itemsList));
        } catch (error) {
          console.error("Error", error);
          alert(
            "Contracts not deployed to the current network " +
              networkId.toString()
          );
        }
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.` +
            error
        );
        console.error(error);
      }
    };
    
    init();
  }, [dispatch]);

	const paginate = ({ selected }) => {
		setCurrentPage(selected + 1);
	};

  return (
    <div className={classes.homepage}>
      <section className={classes.banner}>
        <Grid container spacing={0} className={classes.gridBanner}>
          <Grid item xs={3}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <img src={dreaming} alt="dreaming" className={classes.images} />
              </Grid>
              <Grid item xs={4}>
                <img src={veterans} alt="veterans" className={classes.images} />
              </Grid>
              <Grid item xs={7}>
                <img src={modeling3d} alt="modeling3d" className={classes.images} />
              </Grid>
              <Grid item xs={5}>
                <img src={lionKing} alt="lionKing" className={classes.images} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.main}>
            <img src={galerie} alt="galerie" />
            <Typography>A decentralized NFT marketplace where you can expose your art.</Typography>
            <Link to="/create-nft">
              <Button variant="contained" color="primary" disableElevation>
                Mint your art
              </Button>
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Grid container spacing={0}>
              <Grid item xs={8}>
                <img src={stones} alt="dreaming" className={classes.images} />
              </Grid>
              <Grid item xs={4}>
                <img src={woman} alt="veterans" className={classes.images} />
              </Grid>
              <Grid item xs={7}>
                <img src={wale} alt="modeling3d" className={classes.images} />
              </Grid>
              <Grid item xs={5}>
                <img src={comic} alt="lionKing" className={classes.images} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </section>
      <section className={classes.allNfts}>
        <Typography className={classes.title}>Latest artwork</Typography>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {nftList.map((nft) => 
            <Grid item key={nft.tokenId}>
              <Card {...nft} />
            </Grid>
          )}
        </Grid>
        <ReactPaginate
						onPageChange={paginate}
						pageCount={Math.ceil(nftAllList.length / cardsPerPage)}
						previousLabel={'Prev'}
						nextLabel={'Next'}
						containerClassName={'pagination'}
						pageLinkClassName={'page-number'}
						previousLinkClassName={'page-number'}
						nextLinkClassName={'page-number'}
						activeLinkClassName={'active'}
					/>
      </section>
    </div>
  );
};

export default Home;
