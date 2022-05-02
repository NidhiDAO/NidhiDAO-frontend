import { makeStyles } from "@material-ui/styles";

import { NFT } from "src/helpers/useUserNfts";

type Props = {
  onClick: (nft: NFT) => void;
  nft: NFT;
  active: boolean;
};

const useStyles = makeStyles(theme => ({
  itemWrapper: {
    display: "flex",
    alignItems: "center",
    borderRadius: "6px",
    height: 73,
    padding: 15,
    border: "1px solid #344750",
    cursor: "pointer",
    transition: ".2s",
    "&:hover": {
      backgroundColor: "#344750",
      transition: ".2s",
    },
  },
  itemName: { fontSize: 16, fontWeight: 400, lineHeight: "20px" },
  itemValue: { fontSize: "10px", fontWeight: 400, lineHeight: "24px" },
  imgWrapper: { marginRight: 15 },
  active: {
    backgroundColor: "#344750",
  },
}));

function NFTOption({ nft, onClick, active }: Props) {
  const classes = useStyles();

  return (
    <div className={`${classes.itemWrapper} ${active ? classes.active : ""}`} onClick={() => onClick(nft)}>
      <div className={classes.imgWrapper}>
        <img height="40" width="36" src={nft.img} alt={nft.name} />
      </div>
      <div>
        <div className={classes.itemName}>{nft.name}</div>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: "24px" }}>
          {nft.tokenAmount} <span className={classes.itemValue}>(${nft.usdcPrice})</span>
        </div>
      </div>
    </div>
  );
}

export default NFTOption;
