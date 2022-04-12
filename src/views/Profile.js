import React from "react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "redux/blockchain/blockchainActions.js";
import { fetchData } from "redux/data/dataActions.js";
import styled from "styled-components";
import * as s from "assets/styles/globalStyles";

import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 0px;
  border: none;
  background-color: #c875ff;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  // box-shadow: 2px 3px 0px -2px rgba(250, 250, 250, 0.3);
  // -webkit-box-shadow: 2px 3px 0px -2px rgba(250, 250, 250, 1);
  // -moz-box-shadow: 2px 3px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    background-color: var(--hover);
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: 1px;
  // border-style: solid;
  // border-color: var(--round-button-border-color);
  background-color: var(--round-button);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    -webkit-background-color: var(--round-button-hover);
    -moz-background-color: var(--round-button-hover);
    background-color: var(--round-button-hover);
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 0px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--styled-link-color);
  text-decoration: none;
`;

export const StyledLogo = styled.img`
  width: 100px;
  border-radius: 10%;
  @media (min-width: 767px) {
    width: 100px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function Profile() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    WL_WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let WLcost = CONFIG.WL_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalWLCostWei = String(WLcost * mintAmount);
    let totalGasLimit = String(gasLimit);// * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });

  };

  const claimNFTsForWL = () => {
    let cost = CONFIG.WEI_COST;
    let WLcost = CONFIG.WL_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalWLCostWei = String(WLcost * mintAmount);
    let totalGasLimit = String(gasLimit);// * mintAmount);
    console.log("Cost: ", totalWLCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalWLCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  }

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="bg-image absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url(config/images/dctr.png)",
              backgroundRepeat: "repeat-x",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="..."
                        src={require("assets/img/team-2-800x800.gif").default} // pfp
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-24 sm:mt-0 zzz-alignCenter">
                      <button
                        className="zzz-align-left zzz-button-margin-right bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        // style={{
                        //   marginRight: '10px'}}
                        onClick={(e) => {
                          window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                        }}
                      >
                        Opensea
                      </button>
                      <button
                        className="zzz-align-right zzz-button-margin-left bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        // style={{
                        //   marginLeft: '10px'}}
                        onClick={(e) => {
                          window.open("https://twitter.com/thefuckingdctr", "_blank");
                        }}
                      >
                        Twitter
                      </button>
                    </div>

                  </div>


                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-1">
                      <div className="mr-4 p-3 text-center">
                        <span style={{ display: 'flex' }} className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {CONFIG.DISPLAY_COST}<img className="zzz-eth-logo" src="config/images/eth.png" alt="eth"></img>
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Price
                        </span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {Number(data.totalSupply)}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Minted
                        </span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {CONFIG.MAX_SUPPLY}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Supply
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="text-center mt-0">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {CONFIG.NFT_NAME}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <p className="text-grey">Prevent World War III without taking up arms. 100% donates to Ukraine. </p>
                  </div>
                  <s.SpacerMedium />
                  <div className="mb-2 text-blueGray-600">
                    <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                      Optimized contract on ERC721A ➚
                    </StyledLink>
                  </div>
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                    <>
                      <span className="font-bold leading-normal mb-2 text-blueGray-700 mb-2" >
                        Sold out!
                      </span>
                      <span className="font-bold leading-normal mb-2 text-blueGray-700 mb-2" >
                        You can still find {CONFIG.NFT_NAME} on
                      </span>
                      <s.SpacerSmall />
                      <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                        {CONFIG.MARKETPLACE}
                      </StyledLink>
                    </>
                  ) : (
                    <>
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                        Public Sale - soon
                      </h3>
                      <h4 className="font-bold leading-relaxed text-xl mb-2 text-blueGray-700 mb-2">
                        PUBLIC SALE PRICE - {CONFIG.DISPLAY_COST} {CONFIG.NETWORK.SYMBOL} {/* NFT costs */}
                      </h4>
                      <h4 className="font-bold leading-relaxed text-xl mb-2 text-blueGray-700 mb-2">
                        FUCK LIST PRICE - {CONFIG.WL_COST} {CONFIG.NETWORK.SYMBOL} {/* NFT wl costs */}
                      </h4>

                      {/* <span className="font-semibold leading-normal mb-2 text-blueGray-700 mb-2" >
                        Excluding gas fees.
                      </span> */}
                      <s.SpacerSmall />
                      {blockchain.account === "" ||
                        blockchain.smartContract === null ? (
                        <div ai={"center"} jc={"center"}>
                          {/* <span className="font-bold leading-normal mb-2 text-blueGray-700 mb-2" >
                            Connect to the {CONFIG.NETWORK.NAME} network
                          </span>
                          <s.SpacerSmall /> */}

                          {/* <button
                            className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-0 mb-1 ease-linear transition-all duration-150"
                            style={{
                              margin: "5px",
                              // fontFamily: "Montserrat",
                              fontFamily: "Poppins",
                              fontFamily: "sans-serif",
                              fontSize: 12,
                              fontWeight: "800",
                              // fontFamily: "sans-serif",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(connect());
                              getData();
                            }}
                          >
                            CONNECT
                          </button> */}
                          {blockchain.errorMsg !== "" ? (
                            <>
                              <s.SpacerSmall />
                              <span className="font-semibold leading-normal mb-2 text-blueGray-700 mb-2" >
                                {blockchain.errorMsg}
                              </span>
                            </>
                          ) : null}
                        </div>
                      ) : (
                        <>
                          <span className="font-bold leading-normal mb-2 text-blueGray-700 mb-2" >
                            {feedback}
                          </span>
                          <s.SpacerMedium />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <s.SpacerMedium />
                            <span className="font-bold leading-normal mb-2 text-blueGray-700 mb-2" >

                              {mintAmount}
                            </span>
                            <s.SpacerMedium />
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount();
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>
                          <s.SpacerSmall />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <button
                              className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-0 mb-1 ease-linear transition-all duration-150"
                              disabled={claimingNft ? 1 : 0}
                              style={{
                                marginRight: "10px"
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                              }}
                            >
                              {claimingNft ? "BUSY" : "MINT"}
                            </button>
                            {/*<button
                              className="bg-yellow-200 active:bg-lightBlue-600 uppercase text-black font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-0 mb-1 ease-linear transition-all duration-150"
                              disabled={claimingNft ? 1 : 0}
                              style={{
                                marginLeft: "10px"
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTsForWL();
                                getData();
                              }}
                            >
                              {claimingNft ? "BUSY" : "WL MINT"}
                            </button>*/}
                          </s.Container>
                        </>
                      )}
                      <div className="w-full px-4 lg:order-3 lg:text-right lg:self-center">
                        <div className="py-6 px-3 mt-24 sm:mt-0 " style={{ textAlign: 'center' }}>
                          <a href="https://raritysniper.com/nft-drops-calendar?saleDate=2022-04-05" target={"_blank"}>
                            <StyledLogo
                              style={{ display: 'inline', marginRight: '10px' }}
                              alt={"logo"}
                              src={"/config/images/logo2-black.png"}
                            />
                          </a>
                          <a href="https://wenmint.io/drop/the-fucking-dictator-club" target={"_blank"}>
                            <StyledLogo
                              style={{ display: 'inline', marginLeft: '10px' }}
                              alt={"logo"}
                              src={"/config/images/badge.png"}
                            />
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        Please make sure you are connected to the right network (Ethereum Mainnet) and the correct address. Please note: Once you make the purchase, you cannot undo this action.
                      </p>
                      <s.SpacerXSmall />
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        We have set the gas limit to 285000 for the contract to successfully mint your NFT. We recommend that you don't lower the gas limit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
