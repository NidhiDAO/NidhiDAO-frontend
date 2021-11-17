import { Button, SvgIcon } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { ReactComponent as WalletIcon } from "../assets/icons/wallet.svg";

const ConnectButton = () => {
  const { connect } = useWeb3Context();
  return (
    <Button
      endIcon={<SvgIcon className="stake-wallet-icon" viewBox="0 0 24 19" component={WalletIcon} />}
      variant="contained"
      color="primary"
      className="connect-button"
      onClick={connect}
      key={1}
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
