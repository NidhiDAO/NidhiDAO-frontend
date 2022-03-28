import React from "react";
import {
  Backdrop,
  Button,
  Box,
  Fade,
  Grid,
  Paper,
  Typography,
  makeStyles,
  SvgIcon,
  FormControl,
  MenuItem,
  Select,
  ListItemText,
} from "@material-ui/core";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import SwapHeader from "../SwapHeader";
import SwapInput from "../SwapInput";
import NFTOption from "../NFTOption";
import { addresses } from "src/constants";
import PassiveIncomeNFTSwap from "src/abi/PassiveIncomeNFTSwap.json";
import { clearPendingTxn, fetchPendingTxns, isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { error } from "src/slices/MessagesSlice";
import PassiveIncomeNFT from "src/abi/PassiveIncomeNFT.json";
import getUserNfts, { NFT } from "src/helpers/getUserNfts";
import { ReactComponent as ArrowDown } from "src/assets/icons/arrow-down.svg";
import { ReactComponent as TNGBL } from "src/assets/icons/tngbl.svg";
import { ReactComponent as CaretDownIcon } from "src/assets/icons/caret-down.svg";
import { ReactComponent as ArrowBack } from "src/assets/icons/arrow-back.svg";

const useStyles = makeStyles(theme => ({
  swapModal: {
    padding: "35px 28px",
    width: "498px",
    height: "580px",
    background: "#182328",
    boxShadow: "0px 16.8774px 16.8774px rgba(0, 0, 0, 0.05)",
    borderRadius: "20px",
    [theme.breakpoints.down("sm")]: {
      padding: "30px 15px",
      margin: "15px",
      overflowY: "scroll",
    },
  },
  swapWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "15px",
    alignItems: "center",
    margin: "auto",
    height: "100%",
  },
  swapInputWrapper: {
    width: "100%",
  },
  swapInput: {
    width: "441px",
    height: "90px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    paddingTop: 30,
    paddingRight: 14,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& input": {
      paddingBottom: "0px",
      fontSize: "20px",
      fontWeight: 700,
      textAlign: "right",
      paddingRight: "0px",
      paddingLeft: "0px",
      padding: "0px",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent",
    },
  },
  swampSelect: {
    ":active": {
      backgroundColor: "transparent",
    },
    "& fieldset": {
      border: "none",
    },
  },
  primaryLabelWrapper: {
    marginTop: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& span": {
      fontSize: "20px",
      fontWeight: 400,
      lineHeight: "26px",
    },
  },
  inputLabelsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: 14,
    position: "absolute",
    top: 5,
    width: "100%",
  },
  rightAdornmentIcon: {
    display: "flex",
    height: 90,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "end",
  },
  inputSecondaryLabel: {
    fontSize: "12px",
    color: "#fff",
    opacity: 0.5,
  },
  inputSecondaryLabelGold: {
    fontSize: "12px",
    color: "#ffbc45",
    lineHeight: "12px",
  },
  menuList: {
    padding: 0,
  },
  menuItem: {
    py: "12px",
    px: "20px",
    minHeight: 61,
    cursor: "pointer",
    backgroundColor: "#232E33 !important",
    "&:hover": {
      backgroundColor: "#344750 !important",
    },
  },
  info: {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "15px",
  },
  colorYellow: {
    color: "#ffbc45",
  },
  buttonSwap: {
    width: "100%",
    borderRadius: "100px",
    height: "48px",
    maxHeight: "48px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
  },
  titleWrapper: {
    width: "100%",
    marginBottom: "15px",
  },
  nftPicker: {
    width: 441,
    padding: 14,
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    height: 90,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  nftPickerLabels: { display: "flex", justifyContent: "space-between" },
  nftPickerValue: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  nftOptionsWrapper: { display: "flex", alignItems: "center", gap: 15, width: "100%" },
  cursorPointer: { cursor: "pointer" },
  nftOptionsTitle: { fontSize: 16, fontWeight: 400, lineHeight: "20px" },
  nftOptionsContent: {
    marginTop: 15,
    width: "100%",
    gap: 15,
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    height: "100%",
  },
  notchedOutline: {
    border: "none",
  },
}));

function SwapNFT() {
  const [lockDuration, setLockDuration] = React.useState("12");
  const [quantity, setQuantity] = React.useState("0.0");
  const [isSwapPhase, setIsSwapPhase] = React.useState(false);
  const [onlyLock, setOnlyLock] = React.useState(false);
  const [selectedNft, setSelectedNft] = React.useState<NFT>();
  const [currentView, setCurrentView] = React.useState(0);
  const classes = useStyles();
  const { provider, chainID } = useWeb3Context();

  const dispatch = useDispatch();

  const pendingTransactions = useSelector((state: any) => {
    return state.pendingTransactions;
  });

  const userNFTs = getUserNfts();

  const swapGuru = async () => {
    let swapTx;
    let isError;
    try {
      const signer = provider.getSigner();

      const passiveIncomeNFTSwapAddress = addresses[chainID].PASSIVE_INCOME_NFT_SWAP;
      const swapContract = new ethers.Contract(passiveIncomeNFTSwapAddress, PassiveIncomeNFTSwap, signer);
      swapTx = await swapContract.swap(selectedNft, lockDuration, onlyLock);

      dispatch(
        fetchPendingTxns({
          txnHash: swapTx.hash,
          text: "Swaping NFTs",
          type: "nft_swap",
        }),
      );

      await swapTx.wait();
    } catch ({ message }) {
      isError = true;
      setOnlyLock(true);
      dispatch(error("The multiplier not being available for the amount of tokens"));
      console.log("message", message);
    } finally {
      if (swapTx) {
        dispatch(clearPendingTxn(swapTx.hash));
      }

      if (!isError) {
        setIsSwapPhase(false);
        setOnlyLock(false);
      }
    }
  };

  const onApproval = async () => {
    let approveTx = null;
    let isError = false;
    try {
      const signer = provider.getSigner();
      const guru_address = addresses[chainID].GURU_ADDRESS;
      const guruContract = new ethers.Contract(guru_address, PassiveIncomeNFT, signer);

      approveTx = await guruContract.approve(guru_address, ethers.constants.MaxUint256);

      dispatch(
        fetchPendingTxns({
          txnHash: approveTx.hash,
          text: "Approving GURU Swap",
          type: "nft_swap",
        }),
      );

      await approveTx?.wait();
    } catch (err) {
      isError = true;
      dispatch(error("There was an error approving the transaction, please try again"));
      console.log("error", err);
    } finally {
      if (!isError) {
        setIsSwapPhase(true);
      }
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  };

  const onSubmit = async () => {
    if (!selectedNft) {
      return;
    }
    if (isSwapPhase) {
      await swapGuru();
      return;
    }

    await onApproval();
  };

  const setNft = (nft: NFT) => {
    setSelectedNft(nft);
    setCurrentView(0);

    handleSelectedNFT(nft);
  };

  const handleSelectedNFT = async (nft: NFT) => {
    const signer = provider.getSigner();
    const passiveIncomeNFTAddress = addresses[chainID].PASSIVE_INCOME_NFT;

    const guruContract = new ethers.Contract(passiveIncomeNFTAddress, PassiveIncomeNFT, signer);
    // const claimableIncome = await guruContract.claimableIncome(nft.tokenId.toString());
  };

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="bond-view">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className={classes.swapModal}>
              <SwapHeader displayName="Swap GURU for TNGBL" />
              <Box className={classes.swapWrapper}>
                {currentView === 0 ? (
                  <>
                    <Box className={classes.titleWrapper}>
                      <Typography variant="h5" color="textPrimary" className={classes.title}>
                        Swap NFTs
                      </Typography>
                    </Box>
                    <div className={classes.nftPicker} onClick={() => setCurrentView(1)}>
                      <div className={classes.nftPickerLabels}>
                        <span className={classes.inputSecondaryLabel}>From</span>
                        <span className={classes.inputSecondaryLabel}>${selectedNft?.price.toString()}</span>
                      </div>
                      <div className={classes.nftPickerValue}>
                        <div className={classes.primaryLabelWrapper}>
                          <span>{selectedNft?.name || "Select Passive income NFT"}</span>
                        </div>
                        <SvgIcon component={CaretDownIcon} htmlColor="transparent" />
                      </div>
                    </div>
                    <Box>
                      <SvgIcon component={ArrowDown} htmlColor="#A3A3A3" />
                    </Box>
                    <SwapInput
                      name="receive"
                      value={quantity}
                      disabled
                      leftLabel={<span>3,3+ NFT + Image NFT</span>}
                      leftSecondaryLabel={<span className={classes.inputSecondaryLabel}>Receive</span>}
                      rightSecondaryLabel={
                        <span className={classes.inputSecondaryLabel}>${selectedNft?.price.toString()}</span>
                      }
                      rightLabel={
                        <div className={classes.rightAdornmentIcon}>
                          <div className={classes.primaryLabelWrapper} style={{ marginTop: 0 }}>
                            <SvgIcon component={TNGBL} htmlColor="#A3A3A3" />
                          </div>
                        </div>
                      }
                    />
                    <FormControl variant="outlined" color="primary" fullWidth>
                      <div className={classes.inputLabelsWrapper}>
                        <span className={classes.inputSecondaryLabel}>Select multiplier</span>
                      </div>
                      <Select
                        labelId="tnft-select-label"
                        id="tnft-select"
                        value={24}
                        MenuProps={{ classes: { list: classes.menuList } }}
                        className={`${classes.swapInput} ${classes.swampSelect}`}
                        inputProps={{ disableUnderline: true }}
                        onChange={({ target }) => {
                          setLockDuration(target.value as string);
                        }}
                        IconComponent={() => <SvgIcon component={CaretDownIcon} htmlColor="transparent" />}
                      >
                        <MenuItem value={"24"} className={classes.menuItem}>
                          <ListItemText
                            primary="24x (24 months)"
                            primaryTypographyProps={{
                              style: {
                                fontSize: "20px",
                                lineHeight: "25px",
                                fontWeight: 400,
                              },
                            }}
                          />
                        </MenuItem>
                        <MenuItem value={"12"} className={classes.menuItem}>
                          <ListItemText
                            primary="12x (12 months)"
                            primaryTypographyProps={{
                              style: {
                                fontSize: "20px",
                                lineHeight: "25px",
                                fontWeight: 400,
                              },
                            }}
                          />
                        </MenuItem>
                        <MenuItem value={"48"} className={classes.menuItem}>
                          <ListItemText
                            primary="48x (48 months)"
                            primaryTypographyProps={{
                              style: {
                                fontSize: "20px",
                                lineHeight: "25px",
                                fontWeight: 400,
                              },
                            }}
                          />
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <Box style={{ marginTop: 15, marginBottom: 15 }}>
                      <span className={classes.info}>
                        1 to 1 swap. <span className={classes.colorYellow}>LEARN MORE</span>
                      </span>
                    </Box>
                    <Button
                      onClick={onSubmit}
                      variant="contained"
                      color="primary"
                      id="bond-btn"
                      className={classes.buttonSwap}
                      disabled={isPendingTxn(pendingTransactions, "nft_swap")}
                    >
                      {txnButtonText(pendingTransactions, "nft_swap", isSwapPhase ? "Swap" : "Approve")}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className={classes.nftOptionsWrapper}>
                      <SvgIcon
                        component={ArrowBack}
                        htmlColor="#A3A3A3"
                        onClick={() => setCurrentView(0)}
                        className={classes.cursorPointer}
                      />
                      <span className={classes.nftOptionsTitle}>Passive income NFT</span>
                    </div>
                    <div className={classes.nftOptionsContent}>
                      {userNFTs.map(nft => {
                        return <NFTOption nft={nft} onClick={setNft} active={selectedNft?.tokenId === nft.tokenId} />;
                      })}
                    </div>
                  </>
                )}
              </Box>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default SwapNFT;
