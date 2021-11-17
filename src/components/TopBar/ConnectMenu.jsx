import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link, Slide, Fade } from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as CaretDownIcon } from "../../assets/icons/caret-down.svg";
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";
import { ReactComponent as GreenEllipsisIcon } from "../../assets/icons/greenEllipse.svg";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { shorten } from "../../helpers";

function ConnectMenu({ theme }) {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const address = useAddress();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = "";
  let clickFunc = connect;

  const open = Boolean(anchorEl);

  const handleClick = event => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  function handleClose() {
    setAnchorEl(null);
  }

  if (isConnected) {
    buttonText = shorten(address);
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }
  const id = open ? "ohm-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? " hovered-button" : "");

  // const getEtherscanUrl = txnHash => {
  //   return chainID === 4 ? "https://rinkeby.etherscan.io/tx/" + txnHash : "https://etherscan.io/tx/" + txnHash;
  // };

  // useEffect(() => {
  //   if (pendingTransactions.length === 0) {
  //     setAnchorEl(null);
  //   }
  // }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <Box
      // onMouseEnter={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      // onMouseLeave={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      className="wallet-menu"
      id="wallet-menu"
    >
      {connected ? (
        <Button
          id="wallet-menu-button"
          className={buttonStyles}
          variant="contained"
          color="secondary"
          size="large"
          style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
          onClick={handleClick}
          onMouseOver={handleClick}
          key={1}
        >
          <SvgIcon className="green-ellipse-icon" viewBox="0 0 8 8" component={GreenEllipsisIcon} />
          {buttonText}
          {/*{pendingTransactions.length > 0 && (*/}
          {/*  <Slide direction="left" in={isHovering} {...{ timeout: 333 }}>*/}
          {/*    <SvgIcon className="caret-down" component={CaretDownIcon} htmlColor={primaryColor} />*/}
          {/*  </Slide>*/}
          {/*)}*/}
        </Button>
      ) : (
        <Button
          // className={buttonStyles}
          variant="contained"
          color="secondary"
          fullWidth
          // size="large"
          style={pendingTransactions.length > 0 ? { color: primaryColor } : { padding: "9px", marginLeft: "9px" }}
          onClick={clickFunc}
          key={1}
        >
          <SvgIcon color="primary" viewBox="0 0 24 19" component={WalletIcon} />
        </Button>
      )}

      <Popper id={id} open={open} onClose={handleClose} anchorEl={anchorEl} placement="button" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              {/*<Paper className="ohm-menu" elevation={1}>*/}
              {/*{pendingTransactions.map((x, i) => (*/}
              {/*  <Box key={i} fullWidth>*/}
              {/*    <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} target="_blank" rel="noreferrer">*/}
              {/*      <Button size="large" variant="contained" color="secondary" fullWidth>*/}
              {/*        <Typography align="left">*/}
              {/*          {x.text} <SvgIcon component={ArrowUpIcon} />*/}
              {/*        </Typography>*/}
              {/*      </Button>*/}
              {/*    </Link>*/}
              {/*  </Box>*/}
              {/*))}*/}
              {/*<Box className="add-tokens">*/}
              {/*<Divider color="secondary" />*/}
              <Button
                size="large"
                variant="contained"
                color="secondary"
                onMouseLeave={handleClose}
                onClick={disconnect}
                style={{ marginBottom: "0px", width: `${anchorEl && anchorEl.offsetWidth}px` }}
              >
                <Typography className="logout-button">Logout</Typography>
              </Button>
              {/*</Box>*/}
              {/*</Paper>*/}
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default ConnectMenu;
