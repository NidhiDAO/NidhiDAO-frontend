import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Typography, IconButton, SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import useEscape from "../../hooks/useEscape";

function SwapHeader({ displayName }: { displayName?: string }) {
  const [open, setOpen] = useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  let history = useHistory();

  const onClose = () => {
    if (open) handleClose;
    else history.goBack();
  };

  useEscape(() => {
    onClose();
  });

  return (
    <span
      className="cancel-bond"
      style={{ position: "absolute", right: 15, top: 15, cursor: "pointer" }}
      onClick={onClose}
    >
      <SvgIcon color="primary" component={XIcon} />
    </span>
  );

  // return (
  // <div className="bond-header">
  {
    /* <Link component={NavLink} to="/swap" className="cancel-bond">
        <SvgIcon color="primary" component={XIcon} />
      </Link>

      <div className="bond-header-logo">
        <div className="bond-header-name">
          <Typography variant="h5">{displayName}</Typography>
        </div>
      </div> */
  }

  // <div className="bond-settings">
  // <IconButton onClick={handleOpen}>
  //   <SvgIcon color="primary" component={SettingsIcon} />
  // </IconButton>
  {
    /* <AdvancedSettings
          open={open}
          handleClose={handleClose}
          slippage={slippage}
          recipientAddress={recipientAddress}
          onRecipientAddressChange={onRecipientAddressChange}
          onSlippageChange={onSlippageChange}
        /> */
  }
  // </div>
  // </div>
  // );
}

export default SwapHeader;
