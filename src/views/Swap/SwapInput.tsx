import { FormControl, InputAdornment, makeStyles, OutlinedInput } from "@material-ui/core";
import React from "react";

type ISwapInput = {
  value: string;
  name: string;
  onChange?: (name: string, value: string) => void;
  onBlur?: (name: string, value: string) => void;
  disabled?: boolean;
  rightLabel?: React.ReactNode | string;
  leftLabel?: React.ReactNode | string;
  leftSecondaryLabel?: React.ReactNode | string;
  rightSecondaryLabel?: React.ReactNode | string;
  type?: string;
  inputClassName?: string;
};

const useStyles = makeStyles(theme => ({
  swapInputWrapper: {
    width: "100%",
  },
  swapInput: {
    width: "441px",
    height: "90px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    paddingTop: 30,
    paddingRight: 14,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& input": {
      paddingBottom: "0px",
      fontSize: "20px",
      fontWeight: 400,
      textAlign: "right",
      paddingRight: "0px",
      paddingLeft: "0px",
      padding: "0px",
      color: "#FFF",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent",
    },
  },
  primaryLabelWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    "& span": {
      fontSize: "20px",
      lineHeight: "26px",
    },
  },
  inputLabelsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: 14,
    position: "absolute",
    top: 5,
    width: "100%",
    zIndex: 2,
  },
  rightAdornmentIcon: {
    display: "flex",
    height: 90,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "end",
  },
  colorYellow: {
    color: "#ffbc45",
  },
  notchedOutline: {
    border: "none",
  },
}));

function SwapInput({
  name,
  type,
  value,
  onBlur,
  onChange,
  disabled,
  leftLabel,
  rightLabel,
  rightSecondaryLabel,
  leftSecondaryLabel,
  inputClassName = "",
}: ISwapInput) {
  const classes = useStyles();

  return (
    <FormControl className={classes.swapInputWrapper} variant="outlined" color="primary">
      <div className={classes.inputLabelsWrapper}>
        <div>{leftSecondaryLabel}</div>
        <div>{rightSecondaryLabel}</div>
      </div>
      <OutlinedInput
        name={name}
        type={type}
        disabled={disabled}
        placeholder="Enter an amount"
        className={`${classes.swapInput} ${inputClassName}`}
        classes={{ notchedOutline: classes.notchedOutline }}
        value={value}
        onChange={e => {
          if (onChange) {
            onChange(name, e.target.value);
          }
        }}
        onBlur={e => {
          if (onBlur) {
            onBlur(name, e.target.value);
          }
        }}
        labelWidth={0}
        startAdornment={
          leftLabel ? (
            <InputAdornment position="start">
              <div className={classes.primaryLabelWrapper}>{leftLabel}</div>
            </InputAdornment>
          ) : null
        }
        endAdornment={
          rightLabel ? (
            <InputAdornment position="end">
              <div className={classes.rightAdornmentIcon}>
                <div className={classes.primaryLabelWrapper} style={{ marginTop: 0 }}>
                  {rightLabel}
                </div>
              </div>
            </InputAdornment>
          ) : null
        }
      />
    </FormControl>
  );
}

export default SwapInput;
