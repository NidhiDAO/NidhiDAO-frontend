export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 2.2;

export const TOKEN_DECIMALS = 9;

export const POOL_GRAPH_URLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  // Mumbai
  80001: {
    DAI_ADDRESS: "0x52439209dc5f526375b8ab036ef9ea15bf0ce63b",
    GURU_ADDRESS: "0x26112d6e446d150675fa8edb0fd9e3681102ec39",
    STAKING_ADDRESS: "0x3a8ccc3f6b45a6a62c7ed717140a7f4daf7d2151",
    STAKING_HELPER_ADDRESS: "0x5906756f30f8be02bb000715171bb5123682d76e",
    SGURU_ADDRESS: "0x3dd3c8786e83b6e2e38a0e991e588884839315dc",
    DISTRIBUTOR_ADDRESS: "0x2bc3f0f54ed864b5a0e7e51222b5856b765d7057",
    BONDINGCALC_ADDRESS: "0x9d64d0853de0df69d78cddcbf5c7f480eda84ec4",
    TREASURY_ADDRESS: "0x7e47ae6767ac436dc8c9f8f5f95ed49a70e96535",
    REDEEM_HELPER_ADDRESS: "0x9b0b321a06f4a2d2081fa8a3ba3a598d84845017",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    CLAIM_ADDRESS: "0x7f6bE1318f3a49697a79C0c8C443895F897eD426",
    AGURU_ADDRESS: "0x9E375e1DAEddC5c9C6cB3f67B666169A95173eFD",
    // PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    // PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281",
    // PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b",
  },
};
