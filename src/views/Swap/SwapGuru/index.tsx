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
import SwapHeader from "../SwapHeader";
import SwapInput from "../SwapInput";
import { useWeb3Context } from "src/hooks/web3Context";
import { clearPendingTxn, fetchPendingTxns, isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { error } from "src/slices/MessagesSlice";
import { addresses } from "src/constants";
import PassiveIncomeNFT from "src/abi/PassiveIncomeNFT.json";
import PassiveIncomeNFTSwap from "src/abi/PassiveIncomeNFTSwap.json";
import { ReactComponent as GURU } from "src/assets/icons/guru.svg";
import { ReactComponent as ArrowDown } from "src/assets/icons/arrow-down.svg";
import { ReactComponent as TNGBL } from "src/assets/icons/tngbl.svg";
import { ReactComponent as CaretDownIcon } from "src/assets/icons/caret-down.svg";
import useLockOptions, { MIN_LOCK_DURATION } from "../useLockOptions";
import getPrice from "src/helpers/getPrice";
import debounce from "lodash/debounce";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  swapModal: {
    padding: "35px 28px",
    maxWidth: "498px",
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
  receiveInputLeftLabel: {
    fontSize: "20px",
    fontWeight: 400,
    lineHeight: "26px",
  },
  payInputLeftLabel: {
    fontWeight: 700,
  },
  inputClassName: {
    "& input": {
      fontWeight: 700,
    },
  },
  primaryTypographyProps: {
    fontSize: "20px",
    lineHeight: "25px",
    fontWeight: 400,
  },
}));

function SwapGuru() {
  const [model, setModel] = React.useState({
    pay: "",
    receive: "",
    lockPeriod: MIN_LOCK_DURATION,
  });
  const [isSwapPhase, setIsSwapPhase] = React.useState(false);
  const [onlyLock, setOnlyLock] = React.useState(false);
  const { provider, chainID } = useWeb3Context();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const ohmBalance = useSelector((state: any) => state.account.balances && state.account.balances.ohm);
  const lockOptions = useLockOptions();

  const pendingTransactions = useSelector((state: any) => state.pendingTransactions);

  const setMax = () => {
    setModel(currentState => ({ ...currentState, pay: ohmBalance, receive: ohmBalance }));
    getUSDCPrice(ohmBalance);
  };

  const swapGuru = async () => {
    let swapTx;
    let isError;
    try {
      const signer = provider.getSigner();

      const swapContract = new ethers.Contract(
        addresses[chainID].PASSIVE_INCOME_NFT_SWAP,
        PassiveIncomeNFTSwap,
        signer,
      );

      const swapAmount = ethers.utils.parseUnits(model.pay, "gwei");
      swapTx = await swapContract.swapGURU(swapAmount, model.lockPeriod, onlyLock);

      dispatch(
        fetchPendingTxns({
          txnHash: swapTx.hash,
          text: "Swapping GURU to NFTs",
          type: "guru_swap",
        }),
      );

      await swapTx.wait();
    } catch (err: any) {
      isError = true;
      setOnlyLock(true);
      dispatch(error(err.message));
      console.error("error", err);
    } finally {
      if (swapTx) {
        dispatch(clearPendingTxn(swapTx.hash));
        history.goBack();
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
      const passiveIncomeNFTAddress = addresses[chainID].PASSIVE_INCOME_NFT_SWAP;
      const guruContract = new ethers.Contract(guru_address, PassiveIncomeNFT, signer);

      approveTx = await guruContract.approve(passiveIncomeNFTAddress, ethers.constants.MaxUint256);

      dispatch(
        fetchPendingTxns({
          txnHash: approveTx.hash,
          text: "Approving GURU Swap",
          type: "guru_swap",
        }),
      );

      await approveTx.wait();
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
    const pay = Number(model.pay);
    if (isNaN(pay) || pay === 0) {
      dispatch(error("Please enter a value!"));
      return;
    }
    if (isSwapPhase) {
      await swapGuru();
      return;
    }

    await onApproval();
  };

  const getUSDCPrice = async (tokenAmount: string) => {
    try {
      const value = await getPrice({
        addressIn: addresses[chainID].TANGIBLE_ADDRESS,
        addressOut: addresses[chainID].USDC_ADDRESS,
        tokenAmount: tokenAmount,
        provider,
      });

      setModel(currentModel => ({ ...currentModel, receive: value }));
    } catch (err: any) {
      console.error("err", err);
      dispatch(error(err.message));
    }
  };

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="bond-view">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className={classes.swapModal}>
              <SwapHeader displayName="Swap GURU for TNGBL" />
              <Box className={classes.swapWrapper}>
                <Box className={classes.titleWrapper}>
                  <Typography variant="h5" color="textPrimary" className={classes.title}>
                    Swap GURU for 3,3+ NFT
                  </Typography>
                </Box>
                <SwapInput
                  name="pay"
                  value={model.pay}
                  type="number"
                  onChange={(name, value) => {
                    setModel(currentState => ({ ...currentState, [name]: value }));
                    debounce(() => getUSDCPrice(value), 200)();
                  }}
                  leftLabel={
                    <>
                      <SvgIcon component={GURU} htmlColor="#A3A3A3" style={{ marginRight: 5 }} />
                      <span className={classes.payInputLeftLabel}>GURU</span>
                    </>
                  }
                  leftSecondaryLabel={<span className={classes.inputSecondaryLabel}>Pay</span>}
                  rightSecondaryLabel={
                    <Button variant="text" onClick={setMax} color="inherit" style={{ padding: 0, cursor: "pointer" }}>
                      <span className={classes.inputSecondaryLabelGold}>MAX</span>
                    </Button>
                  }
                  inputClassName={classes.inputClassName}
                />
                <Box>
                  <SvgIcon component={ArrowDown} htmlColor="#A3A3A3" />
                </Box>
                <SwapInput
                  name="receive"
                  value={model.pay || "0"}
                  type="text"
                  disabled
                  onChange={(name, value) => {
                    setModel(currentState => ({ ...currentState, [name]: value }));
                  }}
                  leftLabel={<span className={classes.receiveInputLeftLabel}>3,3+ NFT</span>}
                  leftSecondaryLabel={<span className={classes.inputSecondaryLabel}>Receive</span>}
                  rightSecondaryLabel={<span className={classes.inputSecondaryLabel}>${model.receive || "0.0"}</span>}
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
                    name="lockPeriod"
                    labelId="tnft-select-label"
                    id="tnft-select"
                    value={model.lockPeriod}
                    MenuProps={{ classes: { list: classes.menuList } }}
                    className={`${classes.swapInput} ${classes.swampSelect}`}
                    inputProps={{ disableUnderline: true }}
                    onChange={({ target }) => {
                      setModel(currentState => ({ ...currentState, lockPeriod: target.value as string }));
                    }}
                    IconComponent={() => <SvgIcon component={CaretDownIcon} htmlColor="transparent" />}
                  >
                    {lockOptions.map((option: any) => (
                      <MenuItem value={option.value} className={classes.menuItem} key={option.value}>
                        <ListItemText
                          primary={option.name}
                          primaryTypographyProps={{
                            className: classes.primaryTypographyProps,
                          }}
                        />
                      </MenuItem>
                    ))}
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
                  disabled={isPendingTxn(pendingTransactions, "guru_swap")}
                >
                  {txnButtonText(pendingTransactions, "guru_swap", isSwapPhase ? "Swap" : "Approve")}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default SwapGuru;
