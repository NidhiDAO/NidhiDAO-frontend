import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeApproval, exchangeAGURU } from "../../slices/StakeThunk";
import "./earlyclaim.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import ConnectButton from "../../components/ConnectButton";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function EarlyClaim() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const view = 0;

  const isAppLoading = useSelector(state => state.app.loading);
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const aguruAllowance = useSelector(state => {
    return state.account.claim && state.account.claim.aguruAllowance;
  });
  const aguruBalance = useSelector(state => {
    return state.account.balances && state.account.balances.aguru;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onExchange = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(aguruBalance) || aguruBalance <= 0 || aguruBalance === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("You do not have any aGURU to convert to GURU"));
    }

    await dispatch(exchangeAGURU({ address, aguruBalance, provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "aguru") return aguruAllowance > 0;
      return 0;
    },
    [aguruAllowance],
  );

  const isAllowanceDataLoading = aguruAllowance == null;

  let modalButton = [];

  modalButton.push(<ConnectButton />);

  return (
    <div id="stake-view" className="stake-metrics">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Exchange aGURU for GURU</Typography>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography color="textSecondary" variant="h6">
                    Connect your wallet to exchange aGURU for GURU
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Box className="stake-action-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        !hasAllowance("aguru") && (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              <>
                                First time exchanging <b>aGURU</b>?
                                <br />
                                Please approve NidhiDAO to exchange your <b>aGURU</b> for <b>GURU</b>.
                              </>
                            </Typography>
                          </Box>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("aguru") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "claiming")}
                            onClick={() => {
                              onExchange();
                            }}
                          >
                            {txnButtonText(pendingTransactions, "claiming", "Exchange aGURU")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_claiming")}
                            onClick={() => {
                              console.log("clicked");
                              onSeekApproval("aguru");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_claiming", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <Typography variant="body1">Your Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(ohmBalance, 4)} GURU</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">Amount to Exchange</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(aguruBalance, 0)} aGURU</>}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default EarlyClaim;
