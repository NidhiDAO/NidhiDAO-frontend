import React, { useState, useEffect } from "react";
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
import { BigNumberish, ethers } from "ethers";
import { useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import SwapHeader from "../SwapHeader";
import SwapInput from "../SwapInput";
import NFTOption from "../NFTOption";
import { addresses } from "src/constants";
import PassiveIncomeNFTSwap from "src/abi/PassiveIncomeNFTSwap.json";
import { error as errorAction, info } from "src/slices/MessagesSlice";
import NidhiNft from "src/abi/NidhiNFT.json";
import useUserNFTs, { NFT } from "src/helpers/useUserNfts";
import { ReactComponent as ArrowDown } from "src/assets/icons/arrow-down.svg";
import { ReactComponent as TNGBL } from "src/assets/icons/tngbl.svg";
import { ReactComponent as CaretDownIcon } from "src/assets/icons/caret-down.svg";
import { ReactComponent as ArrowBack } from "src/assets/icons/arrow-back.svg";
import useMultiplierOptions, { minLockDuration } from "../useMultiplierOptions";

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
  primaryTypographyProps: {
    fontSize: "20px",
    lineHeight: "25px",
    fontWeight: 400,
  },
}));

type TransactionStatus = "needs-approval" | "can-swap" | "processing-request" | "wallet-not-connected";

const buttonLabels: Record<TransactionStatus, string> = {
  "can-swap": "Swap",
  "needs-approval": "Approve",
  "processing-request": "Pending...",
  "wallet-not-connected": "Connect wallet",
};

function SwapNFT() {
  const { address, provider, chainID, connect } = useWeb3Context();

  const dispatch = useDispatch();

  const classes = useStyles();

  const [lockDuration, setLockDuration] = useState(minLockDuration);
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const [currentView, setCurrentView] = useState(0);
  const [swappedNftId, setSwappedNftId] = useState<BigNumberish>();

  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing-request");

  const userNFTs = useUserNFTs();

  const handleSwap = async () => {
    if (!selectedNft) {
      dispatch(errorAction("Please select NFT"));
      return;
    }

    try {
      setTransactionStatus("processing-request");

      const signer = provider.getSigner();
      const swapContract = new ethers.Contract(
        addresses[chainID].PASSIVE_INCOME_NFT_SWAP,
        PassiveIncomeNFTSwap,
        signer,
      );

      const response = await swapContract.swap(selectedNft!.tokenId, lockDuration, false, true);

      await response.wait();

      setTransactionStatus("can-swap");
      dispatch(info("Swapping successfully completed."));
      setSwappedNftId(selectedNft!.tokenId);
      setSelectedNft(undefined);
      setLockDuration(minLockDuration);
    } catch (err: any) {
      setTransactionStatus("can-swap");
      dispatch(errorAction("Swapping token"));
    }
  };

  const handleApprove = async () => {
    try {
      setTransactionStatus("processing-request");

      const { PASSIVE_INCOME_NFT_SWAP, NIDHI_NFT } = addresses[chainID];

      const signer = provider.getSigner();
      const nidhiNft = new ethers.Contract(NIDHI_NFT, NidhiNft, signer);

      const response = await nidhiNft.setApprovalForAll(PASSIVE_INCOME_NFT_SWAP, true);

      await response.wait();
      setTransactionStatus("can-swap");
    } catch (err: any) {
      setTransactionStatus("needs-approval");
      dispatch(errorAction("Approving token"));
    }
  };

  const setNft = (nft: NFT) => {
    setSelectedNft(nft);
    setCurrentView(0);
  };

  useEffect(() => {
    const handleBaseInfo = async () => {
      try {
        const { NIDHI_NFT, PASSIVE_INCOME_NFT_SWAP } = addresses[chainID];

        const signer = provider.getSigner();
        const nidhiNft = new ethers.Contract(NIDHI_NFT, NidhiNft, signer);

        const isApproved = await nidhiNft.isApprovedForAll(address, PASSIVE_INCOME_NFT_SWAP);

        setTransactionStatus(isApproved ? "can-swap" : "needs-approval");
      } catch (error) {
        dispatch(errorAction("Fetching base info"));
      }
    };

    if (address && provider && chainID) {
      handleBaseInfo();
    }
  }, [address, provider, chainID, dispatch]);

  useEffect(() => {
    if (!address) {
      setTransactionStatus("wallet-not-connected");
    }
  }, [address]);

  const submitHandlerByStatus: Record<TransactionStatus, () => void> = {
    "can-swap": handleSwap,
    "needs-approval": handleApprove,
    "processing-request": () => {},
    "wallet-not-connected": connect,
  };

  const onSubmit = submitHandlerByStatus[transactionStatus];

  const { dropdownOptions, isLoading } = useMultiplierOptions();

  const isSubmitDisabled = isLoading || transactionStatus === "processing-request";

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
                        <span className={classes.inputSecondaryLabel}>${selectedNft?.usdcPrice || "0.0"}</span>
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
                      value={selectedNft?.tokenAmount || "0.0"}
                      disabled
                      leftLabel={<span>3,3+ NFT + Image NFT</span>}
                      leftSecondaryLabel={<span className={classes.inputSecondaryLabel}>Receive</span>}
                      rightSecondaryLabel={
                        <span className={classes.inputSecondaryLabel}>${selectedNft?.usdcPrice || "0.0"}</span>
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
                        value={lockDuration}
                        MenuProps={{ classes: { list: classes.menuList } }}
                        className={`${classes.swapInput} ${classes.swampSelect}`}
                        inputProps={{ disableUnderline: true }}
                        onChange={({ target }) => {
                          setLockDuration(target.value as number);
                        }}
                        IconComponent={() => <SvgIcon component={CaretDownIcon} htmlColor="transparent" />}
                      >
                        {dropdownOptions.map(option => (
                          <MenuItem value={option.value} className={classes.menuItem}>
                            <ListItemText
                              primary={option.label}
                              primaryTypographyProps={{
                                className: classes.primaryTypographyProps,
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box style={{ marginTop: 15, marginBottom: 15 }}>
                      <span className={classes.info}>1 to 1 swap</span>
                    </Box>
                    <Button
                      onClick={onSubmit}
                      variant="contained"
                      color="primary"
                      id="bond-btn"
                      className={classes.buttonSwap}
                      disabled={isSubmitDisabled}
                    >
                      {buttonLabels[transactionStatus]}
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
                      {userNFTs
                        .filter(nft => nft.tokenId !== swappedNftId)
                        .map(nft => (
                          <NFTOption nft={nft} onClick={setNft} active={selectedNft?.tokenId === nft.tokenId} />
                        ))}
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
