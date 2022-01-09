import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { prettifySeconds, secondsUntilBlock, shorten, trim } from "../../helpers";
import { bondAsset, calcBondDetails, changeApproval } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import useDebounce from "../../hooks/Debounce";
import { error } from "../../slices/MessagesSlice";
import { DisplayBondDiscount } from "./Bond";
import ConnectButton from "../../components/ConnectButton";
import { BondType } from "../../lib/Bond";

const useStyles = makeStyles({
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
});

function BondPurchase({ bond, slippage, recipientAddress }) {
  const classes = useStyles();

  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const [quantity, setQuantity] = useState("");
  const [tnftId, setTNFTId] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bond?.vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds ?? 0, "day");
  };

  async function onBond() {
    if (quantity === "") {
      dispatch(error("Please enter a value!"));
    } else if (isNaN(quantity)) {
      dispatch(error("Please enter a valid value!"));
    } else if (bond.type === BondType.Gold && tnftId === "") {
      dispatch(error("Please select a TNFT to bond!"));
    } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      if (shouldProceed) {
        await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond,
            networkID: chainID,
            provider,
            address: recipientAddress || address,
            tnftId,
          }),
        );
      }
    } else {
      await dispatch(
        bondAsset({
          value: quantity,
          slippage,
          bond,
          networkID: chainID,
          provider,
          address: recipientAddress || address,
          tnftId,
        }),
      );
      clearInput();
    }
  }

  const clearInput = () => {
    setQuantity(0);
    setTNFTId("");
  };

  const hasAllowance = useCallback(() => {
    return bond.allowance > 0;
  }, [bond.allowance]);

  const setMax = () => {
    let maxQ;
    if (bond.maxBondPrice * bond.bondPrice < Number(bond.balance)) {
      // there is precision loss here on Number(bond.balance)
      maxQ = bond.maxBondPrice * bond.bondPrice.toString();
    } else {
      maxQ = bond.balance;
    }
    setQuantity(maxQ);
  };

  const bondDetailsDebounce = useDebounce(quantity, 1000);

  useEffect(() => {
    dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID, tnftId }));
  }, [bondDetailsDebounce]);

  useEffect(() => {
    let interval = null;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
      setSecondsToRefresh(SECONDS_TO_REFRESH);
    }
    return () => clearInterval(interval);
  }, [secondsToRefresh, quantity, tnftId]);

  const onSeekApproval = async () => {
    dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
  };

  const displayUnits = bond.displayUnits;

  const isAllowanceDataLoading = bond.allowance == null;

  if (bond.type === BondType.Gold) {
    return (
      <Box display="flex" flexDirection="column">
        <Box className="wallet-menu" display="flex" justifyContent="space-around" flexWrap="wrap">
          {!address ? (
            <ConnectButton />
          ) : (
            <>
              {isAllowanceDataLoading ? (
                <Skeleton width="200px" />
              ) : (
                <>
                  <Box
                    className="ohm-input"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ gap: "16px" }}
                  >
                    <Typography variant="body1" align="left" color="textSecondary">
                      If you have not bonded this <b>{bond.displayName} TNFT</b> before. <br /> You will have to approve
                      two transactions (One Approve and One Bond).
                    </Typography>
                    <FormControl variant="outlined" color="primary" fullWidth>
                      <InputLabel id="tnft-select-label">TNFT</InputLabel>
                      <Select
                        labelId="tnft-select-label"
                        id="tnft-select"
                        value={tnftId}
                        label="TNFT"
                        onChange={e => {
                          setTNFTId(e.target.value);
                          setQuantity("1");
                        }}
                        MenuProps={{ classes: { list: classes.menuList } }}
                      >
                        {bond.tangibleNFTs.map(tnft => (
                          <MenuItem
                            key={tnft.tokenId.toString()}
                            value={tnft.tokenId.toString()}
                            className={classes.menuItem}
                          >
                            <ListItemText
                              primary={`${tnft.brand} ${bond.displayName}`}
                              primaryTypographyProps={{
                                style: {
                                  lineHeight: "18px",
                                },
                              }}
                              secondary={`Token ID: ${shorten(tnft.tokenId.toString())}`}
                              secondaryTypographyProps={{
                                style: {
                                  lineHeight: "15px",
                                  color: "white",
                                  opacity: 0.5,
                                },
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {!bond.isAvailable[chainID] ? (
                    <Button
                      variant="contained"
                      color="primary"
                      id="bond-btn"
                      className="transaction-button"
                      disabled={true}
                    >
                      Sold Out
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      id="bond-btn"
                      className="transaction-button"
                      disabled={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
                      onClick={onBond}
                    >
                      {txnButtonText(pendingTransactions, "bond_" + bond.name, "Bond GURU")}
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </Box>

        <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
          <Box className="bond-data">
            <div className="data-row">
              <Typography>Your Balance</Typography>
              <Typography>
                {isBondLoading ? (
                  <Skeleton width="100px" />
                ) : (
                  <>
                    {trim(bond.balance, 4)} {displayUnits}
                  </>
                )}
              </Typography>
            </div>

            <div className={`data-row`}>
              <Typography>You Will Get</Typography>
              <Typography id="bond-value-id" className="price-data">
                {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuote ?? 0, 4) || "0"} GURU`}
              </Typography>
            </div>

            <div className={`data-row`}>
              <Typography>Max You Can Buy</Typography>
              <Typography id="bond-value-id" className="price-data">
                {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice ?? 0, 4) || "0"} GURU`}
              </Typography>
            </div>

            <div className="data-row">
              <Typography>ROI</Typography>
              <Typography>
                {isBondLoading ? <Skeleton width="100px" /> : <DisplayBondDiscount key={bond.name} bond={bond} />}
              </Typography>
            </div>

            <div className="data-row">
              <Typography>Debt Ratio</Typography>
              <Typography>
                {isBondLoading ? <Skeleton width="100px" /> : `${trim((bond.debtRatio ?? 0) / 10000000, 2)}%`}
              </Typography>
            </div>

            <div className="data-row">
              <Typography>Vesting Term</Typography>
              <Typography>{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</Typography>
            </div>

            {recipientAddress !== address && (
              <div className="data-row">
                <Typography>Recipient</Typography>
                <Typography>{isBondLoading ? <Skeleton width="100px" /> : shorten(recipientAddress)}</Typography>
              </div>
            )}
          </Box>
        </Slide>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box className="wallet-menu" display="flex" justifyContent="space-around" flexWrap="wrap">
        {!address ? (
          <ConnectButton />
        ) : (
          <>
            {isAllowanceDataLoading ? (
              <Skeleton width="200px" />
            ) : (
              <>
                {!hasAllowance() ? (
                  <div className="help-text">
                    <em>
                      <Typography variant="body1" align="left" color="textSecondary">
                        First time bonding <b>{bond.displayName}</b>? <br /> Please approve Nidhi to use your{" "}
                        <b>{bond.displayName}</b> for bonding.
                      </Typography>
                    </em>
                  </div>
                ) : (
                  <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      labelWidth={55}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button variant="text" onClick={setMax}>
                            Max
                          </Button>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                )}

                {!bond.isAvailable[chainID] ? (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-btn"
                    className="transaction-button"
                    disabled={true}
                  >
                    Sold Out
                  </Button>
                ) : hasAllowance() ? (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-btn"
                    className="transaction-button"
                    disabled={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
                    onClick={onBond}
                  >
                    {txnButtonText(pendingTransactions, "bond_" + bond.name, "Bond GURU")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-approve-btn"
                    className="transaction-button"
                    disabled={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
                    onClick={onSeekApproval}
                  >
                    {txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </Box>

      <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <Typography>Your Balance</Typography>
            <Typography>
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                <>
                  {trim(bond.balance, 4)} {displayUnits}
                </>
              )}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>You Will Get</Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuote ?? 0, 4) || "0"} GURU`}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>Max You Can Buy</Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice ?? 0, 4) || "0"} GURU`}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>ROI</Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="100px" /> : <DisplayBondDiscount key={bond.name} bond={bond} />}
            </Typography>
          </div>

          <div className="data-row">
            <Typography sx={{ fontWeight: "400" }}>Debt Ratio</Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="100px" /> : `${trim((bond.debtRatio ?? 0) / 10000000, 2)}%`}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>Vesting Term</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</Typography>
          </div>

          {recipientAddress !== address && (
            <div className="data-row">
              <Typography>Recipient</Typography>
              <Typography>{isBondLoading ? <Skeleton width="100px" /> : shorten(recipientAddress)}</Typography>
            </div>
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default BondPurchase;
