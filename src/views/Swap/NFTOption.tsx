import { makeStyles } from "@material-ui/styles";
import React from "react";

type Props = {
  name: string;
  onClick: (nft: string) => void;
  selectedNft: string | null;
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
  active: {
    backgroundColor: "#344750",
  },
}));

function NFTOption({ name, onClick, selectedNft }: Props) {
  const classes = useStyles();

  return (
    <div
      className={`${classes.itemWrapper} ${name === selectedNft ? classes.active : ""}`}
      onClick={() => onClick(name)}
    >
      <div>
        <img
          height="40"
          width="36"
          src="https://www.tangible.store/static/gold-bar-57d104e519b6b7f6e0fc66fc89e4667a.png"
          alt=""
        />
      </div>
      <div>
        <div className={classes.itemName}>{name}</div>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: "24px" }}>
          20.0 <span className={classes.itemValue}>($381.47)</span>
        </div>
      </div>
    </div>
  );
}

export default NFTOption;
