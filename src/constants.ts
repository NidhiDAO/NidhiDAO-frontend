export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const EPOCH_INTERVAL = 11520;

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
    DISTRIBUTOR_ADDRESS: "0x680798797eBf8d5a7cE78806C70CD545777166f2",
    BONDINGCALC_ADDRESS: "0x40742EEbb79d5Acb140c48Fca4E6Db84466C6371",
    TREASURY_ADDRESS: "0x5674AeE1536Db61a7b312026bc9e57B98891b244",
    REDEEM_HELPER_ADDRESS: "0x9b0b321a06f4a2d2081fa8a3ba3a598d84845017",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    CLAIM_ADDRESS: "0x7f6bE1318f3a49697a79C0c8C443895F897eD426",
    AGURU_ADDRESS: "0x9E375e1DAEddC5c9C6cB3f67B666169A95173eFD",
    PASSIVE_INCOME_NFT_SWAP: "0xF0fDA84e29FBcbb4d21cBD951650c0A6C08045eb",
    PASSIVE_INCOME_NFT: "0xD1b60BA1f962433aDc683826C72a24793fD4Ff8F",

    // PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    // PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281",
    // PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b",
  },
  // Polygon
  137: {
    DAI_ADDRESS: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    GURU_ADDRESS: "0x28701a232B566729381C53E47a3f53b08F50eb4C",
    STAKING_ADDRESS: "0x4Eef9cb4D2DA4AB2A76a4477E9d2b07f403f0675",
    STAKING_HELPER_ADDRESS: "0x14d9E4bCc1791aEf83170c6876629F7E60c9Ba1c",
    SGURU_ADDRESS: "0x04568467f0AAe5fb85Bf0e031ee66FF2C200a6Fb",
    DISTRIBUTOR_ADDRESS: "0x4B72d53103C3292490aEF1Bb4b1A184578D984FF",
    BONDINGCALC_ADDRESS: "0x66039dD0B3B9Fb224460c22CEB5b7900e86b1399",
    TREASURY_ADDRESS: "0x05D0A05c1FD3a00CA1fC7a4A7321552C0DD80521",
    REDEEM_HELPER_ADDRESS: "0xfB1Ef64cb181FE693ce9aF04Be511918B7e9dD29",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    CLAIM_ADDRESS: "0xE8A1A9F57Be31c329ca06651752b21FE631b87bc",
    AGURU_ADDRESS: "0xbC4f91Bb7C9FB8B2d5AC7FF7e7f7278ecBBf3F2f",
    PASSIVE_INCOME_NFT_SWAP: "0xF0fDA84e29FBcbb4d21cBD951650c0A6C08045eb",
    PASSIVE_INCOME_NFT: "0xD1b60BA1f962433aDc683826C72a24793fD4Ff8F",
    // PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    // PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281",
    // PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b",
  },
};
