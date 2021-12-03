import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency, trim } from "../../helpers";
import {
  Backdrop,
  Box,
  Fade,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  makeStyles,
  Button,
  SvgIcon,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import BondHeader from "./BondHeader";
import BondRedeem from "./BondRedeem";
import BondPurchase from "./BondPurchase";
import "./bond.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { Skeleton } from "@material-ui/lab";
// import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { ReactComponent as LinkIcon } from "../../assets/icons/link.svg";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  customStyleOnTab: {
    width: "145px",
  },
});

function Bond({ bond, nft }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState();

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const changeView = (event, newView) => {
    setView(newView);
  };

  if (nft) {
    return (
      <Fade in={true} mountOnEnter unmountOnExit>
        <Grid container id="bond-view">
          <Backdrop open={true}>
            <Fade in={true}>
              <Paper className="ohm-card ohm-modal">
                <BondHeader bond={bond} nft />
                <Box direction="column" className="bond-price-data-column">
                  <Typography variant="h6" color="textSecondary">
                    Bond with real world assets
                  </Typography>
                  <Typography variant="h5" color="textPrimary">
                    Gold, Fine Wine, Real Estate and Art
                  </Typography>
                </Box>

                <Tabs
                  centered
                  value={view}
                  textColor="primary"
                  indicatorColor="primary"
                  onChange={changeView}
                  aria-label="bond tabs"
                >
                  <Tab label={<span className={classes.customStyleOnTab}>BOND</span>} {...a11yProps(0)} />
                </Tabs>

                <TabPanel value={view} index={0}>
                  <Box className="wallet-menu bond-nft-box">
                    <Button
                      variant="contained"
                      color="primary"
                      id="bond-coming-soon-btn"
                      className="nft-coming-soon-button nft-coming-soon-button-text "
                      disabled={true}
                      onClick={() => console.log("A")}
                    >
                      COMING SOON
                    </Button>
                    <Typography className="bond-nft-description">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the the industry's standard dummy text ever since the 1500s.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      id="bond-approve-btn"
                      className="transaction-button nft-coming-soon-button"
                      disabled={false}
                      onClick={() => console.log("A")}
                      endIcon={<SvgIcon component={LinkIcon} className="nft-learn-more-button" />}
                    >
                      Learn More
                    </Button>
                  </Box>
                </TabPanel>
              </Paper>
            </Fade>
          </Backdrop>
        </Grid>
      </Fade>
    );
  }

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="bond-view">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className="ohm-card ohm-modal">
              <BondHeader
                bond={bond}
                slippage={slippage}
                recipientAddress={recipientAddress}
                onSlippageChange={onSlippageChange}
                onRecipientAddressChange={onRecipientAddressChange}
              />

              <Box direction="row" className="bond-price-data-row">
                <div className="bond-price-data">
                  <Typography variant="h5" color="textSecondary">
                    Bond Price
                  </Typography>
                  <Typography variant="h3" className="price" color="primary">
                    {isBondLoading ? <Skeleton /> : formatCurrency(bond.bondPrice, 2)}
                  </Typography>
                </div>
                <div className="bond-price-data">
                  <Typography variant="h5" color="textSecondary">
                    Market Price
                  </Typography>
                  <Typography variant="h3" color="primary" className="price">
                    {isBondLoading ? <Skeleton /> : formatCurrency(bond.marketPrice, 2)}
                  </Typography>
                </div>
              </Box>

              <Tabs
                centered
                value={view}
                textColor="primary"
                indicatorColor="primary"
                onChange={changeView}
                aria-label="bond tabs"
              >
                <Tab label={<span className={classes.customStyleOnTab}>BOND</span>} {...a11yProps(0)} />
                <Tab label={<span className={classes.customStyleOnTab}>REDEEM</span>} {...a11yProps(1)} />
              </Tabs>

              <TabPanel value={view} index={0}>
                <BondPurchase bond={bond} slippage={slippage} recipientAddress={recipientAddress} />
              </TabPanel>

              <TabPanel value={view} index={1}>
                <BondRedeem bond={bond} />
              </TabPanel>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

// export function DisplayBondPrice({ bond }) {
//   const { chainID } = useWeb3Context();
//   return (
//     <>
//       {!bond.isAvailable[chainID] ? (
//         <>--</>
//       ) : (
//         `${new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//           maximumFractionDigits: 2,
//           minimumFractionDigits: 2,
//         }).format(bond.bondPrice)}`
//       )}
//     </>
//   );
// }

export function DisplayBondDiscount({ bond }) {
  const { chainID } = useWeb3Context();
  return <>{!bond.isAvailable[chainID] ? <>--</> : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}</>;
}

export default Bond;
