import {
  Typography,
  Box,
  Modal,
  Paper,
  SvgIcon,
  IconButton,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
} from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./bondSettings.scss";

function AdvancedSettings({
  open,
  handleClose,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}) {
  return (
    <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
      <Paper className="ohm-card ohm-popover">
        <Box display="flex">
          <Typography variant="h3">Settings</Typography>
          <IconButton className="settings-close" onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
        </Box>

        <Box className="card-content card-settings">
          <InputLabel color="primary" htmlFor="slippage">
            Slippage
          </InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput
              id="slippage"
              value={slippage}
              onChange={onSlippageChange}
              type="number"
              max="100"
              min="100"
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
            <div className="help-text">
              <Typography variant="body1" color="textSecondary">
                Transaction may revert if price changes by more than slippage %
              </Typography>
            </div>
          </FormControl>

          <InputLabel htmlFor="recipient">Recipient Address</InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput id="recipient" value={recipientAddress} onChange={onRecipientAddressChange} type="text" />
            <div className="help-text">
              <Typography variant="body1" color="textSecondary">
                Choose recipient address. By default, this is your currently connected address
              </Typography>
            </div>
          </FormControl>
        </Box>
      </Paper>
    </Modal>
  );
}

export default AdvancedSettings;
