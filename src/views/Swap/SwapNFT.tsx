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
import { useWeb3Context } from "src/hooks/web3Context";
import SwapHeader from "./SwapHeader";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";
import { ReactComponent as TNGBL } from "../../assets/icons/tngbl.svg";
import { ReactComponent as ArrowBack } from "../../assets/icons/arrow-back.svg";
import TangibleTokenSwap from "../../abi/TangibleTokenSwap.json";
import { ethers } from "ethers";
import SwapInput from "./SwapInput";
import NFTOption from "./NFTOption";

const useStyles = makeStyles(theme => ({
  swapModal: {
    padding: "30px",
    // maxWidth: "498px",
    width: "498px",
    // width: "100%",
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
  },
  primaryLabelWrapper: {
    marginTop: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& span": {
      fontSize: "20px",
      fontWeight: 700,
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
    backgroundColor: "#232E33!important",
    "&:hover": {
      backgroundColor: "#344750!important",
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
}));

function SwapNFT() {
  const [quantity, setQuantity] = React.useState("0.0");
  const [selectedNft, setSelectedNft] = React.useState<string>("");
  const [currentView, setCurrentView] = React.useState(0);
  const { provider } = useWeb3Context();
  const classes = useStyles();

  const setMax = () => {
    setQuantity("10");
  };

  const swapGuru = async () => {
    let swapTx;
    try {
      const signer = provider.getSigner();

      const swapContract = new ethers.Contract(TangibleTokenSwap.address, TangibleTokenSwap.abi, signer);
      const swapAmount = ethers.utils.parseUnits("2", "gwei");

      console.log("swapContract", swapContract);
      console.log("swapAmount", swapAmount);

      swapTx = await swapContract.swap(swapAmount);

      console.log("swapTx", swapTx);

      //   dispatch(
      //     fetchPendingTxns({
      //       txnHash: swapTx.hash,
      //       type: "swap_guru",
      //     }),
      //   );

      await swapTx.wait();
    } catch ({ message }) {
      // @ts-ignore
      //   setError({ message });
      console.log("message", message);
    } finally {
    }
  };

  const setNft = (nft: string) => {
    setSelectedNft(nft);
    setCurrentView(0);
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
                        Swap GURU for 3,3+ NFT
                      </Typography>
                    </Box>
                    <div className={classes.nftPicker} onClick={() => setCurrentView(1)}>
                      <div className={classes.nftPickerLabels}>
                        <span className={classes.inputSecondaryLabel}>From</span>
                        <span className={classes.inputSecondaryLabel}>$0.0</span>
                      </div>
                      <div className={classes.nftPickerValue}>
                        <div className={classes.primaryLabelWrapper}>
                          <span>{selectedNft || "Select Passive income NFT"}</span>
                        </div>
                        <SvgIcon component={ArrowDown} htmlColor="#A3A3A3" />
                      </div>
                    </div>
                    <Box>
                      <SvgIcon component={ArrowDown} htmlColor="#A3A3A3" />
                    </Box>
                    <SwapInput
                      name="receive"
                      value={"0.0"}
                      onChange={(name, value) => {
                        console.log(name, value);
                      }}
                      leftLabel={<span>3,3+ NFT</span>}
                      leftSecondaryLabel={<span className={classes.inputSecondaryLabel}>Receive</span>}
                      rightSecondaryLabel={<span className={classes.inputSecondaryLabel}>${quantity}</span>}
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
                        <span className={classes.inputSecondaryLabel}>Lock period</span>
                      </div>
                      <Select
                        labelId="tnft-select-label"
                        id="tnft-select"
                        value={24}
                        MenuProps={{ classes: { list: classes.menuList } }}
                        className={`${classes.swapInput} ${classes.swampSelect}`}
                      >
                        <MenuItem value={24} className={classes.menuItem}>
                          <ListItemText
                            primary="24 months"
                            primaryTypographyProps={{
                              style: {
                                fontSize: "20px",
                                lineHeight: "25px",
                                fontWeight: 400,
                              },
                            }}
                          />
                        </MenuItem>
                        <MenuItem value={48} className={classes.menuItem}>
                          <ListItemText
                            primary="48 months"
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
                      onClick={swapGuru}
                      variant="contained"
                      color="primary"
                      id="bond-btn"
                      className={classes.buttonSwap}
                    >
                      Swap
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
                      <NFTOption name="Lord Kubera" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Yama" onClick={setNft} selectedNft={selectedNft} />
                      <NFTOption name="Meow" onClick={setNft} selectedNft={selectedNft} />
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
