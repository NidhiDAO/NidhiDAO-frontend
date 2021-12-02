import { trim } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import {
  Box,
  Button,
  Link,
  Paper,
  Typography,
  TableRow,
  TableCell,
  SvgIcon,
  Slide,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import useBonds from "src/hooks/Bonds";
import { useWeb3Context } from "../../hooks/web3Context";

export function BondDataCard({ bond }) {
  const { chainID } = useWeb3Context();
  const { loading } = useBonds(chainID);
  const isBondLoading = !bond.bondPrice ?? true;

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.name}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <Typography>{bond.displayName}</Typography>
            {bond.isLP && (
              <Button color="secondary" href={bond.lpUrl} target="_blank" component={Link}>
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Button>
              // <div>
              //   <Link color="secondary" href={bond.lpUrl} target="_blank">
              //     <Typography color="secondary" variant="body1">
              //       View Contract
              //       <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              //     </Typography>
              //   </Link>
              // </div>
            )}
          </div>
        </div>

        <div className="data-row">
          <Typography>Price</Typography>
          <Typography className="bond-price">
            <>
              {isBondLoading ? (
                <Skeleton width="50px" />
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }).format(bond.bondPrice)
              )}
            </>
          </Typography>
        </div>

        <div className="data-row">
          <Typography>ROI</Typography>
          <Typography>{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</Typography>
        </div>

        <div className="data-row">
          <Typography>Purchased</Typography>
          <Typography>
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </Typography>
        </div>
        <Link component={NavLink} to={`/bonds/${bond.name}`}>
          <Button variant="outlined" color="primary" fullWidth disabled={!bond.isAvailable[chainID]}>
            <Typography variant="h5">{!bond.isAvailable[chainID] ? "Sold Out" : `Bond ${bond.displayName}`}</Typography>
          </Button>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }) {
  const { chainID } = useWeb3Context();
  // Use BondPrice as indicator of loading.
  const isBondLoading = !bond.bondPrice ?? true;
  // const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);

  return (
    <TableRow id={`${bond.name}--bond`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bond.displayName}</Typography>
          {bond.isLP && (
            <Button color="secondary" href={bond.lpUrl} target="_blank" component={Link}>
              <Typography color="textSecondary">View Contract</Typography>
              <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
            </Button>

            // <Link color="secondary" href={bond.lpUrl} target="_blank">
            //   <Typography style={{ fontWeight: 400 }}>
            //     View Contract
            //     <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
            //   </Typography>
            // </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        {bond.isAvailable === false ? (
          <div style={{ width: "80px" }}>
            <Typography style={{ justifyContent: "flex-end" }}>–</Typography>
          </div>
        ) : (
          <Typography>
            <>
              {isBondLoading ? (
                <Skeleton width="50px" />
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }).format(bond.bondPrice)
              )}
            </>
          </Typography>
        )}
      </TableCell>
      <TableCell align="left">
        {bond.isAvailable === false ? (
          <div style={{ width: "50px" }}>
            <Typography style={{ justifyContent: "flex-end" }}>–</Typography>
          </div>
        ) : isBondLoading ? (
          <Skeleton />
        ) : (
          `${trim(bond.bondDiscount * 100, 2)}%`
        )}
      </TableCell>
      <TableCell align="right">
        {bond.isAvailable === false ? (
          <div style={{ width: "40px" }}>
            <Typography style={{ justifyContent: "flex-end" }}>–</Typography>
          </div>
        ) : isBondLoading ? (
          <Skeleton />
        ) : (
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(bond.purchased)
        )}
      </TableCell>
      <TableCell>
        <Link component={NavLink} to={`/bonds/${bond.name}`}>
          <Button variant="contained" color="secondary" disabled={!bond.isAvailable[chainID]}>
            {bond.isAvailable === false ? (
              <Typography variant="h6">COMING SOON</Typography>
            ) : (
              <Typography variant="h6">{!bond.isAvailable[chainID] ? "SOLD OUT" : "BOND"}</Typography>
            )}
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
