import { StableBond, LPBond, NetworkID, CustomBond, BondType, GoldBond } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as GuruDaiImg } from "src/assets/tokens/GURU-DAI.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as GuruFraxImg } from "src/assets/tokens/GURU-FRAX.svg";
import { ReactComponent as GuruLusdImg } from "src/assets/tokens/GURU-LUSD.svg";
import { ReactComponent as GuruEthImg } from "src/assets/tokens/GURU-WETH.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as LusdImg } from "src/assets/tokens/LUSD.svg";
import { ReactComponent as GoldImg } from "src/assets/tokens/GOLD.svg";

import { abi as FraxOhmBondContract } from "src/abi/bonds/OhmFraxContract.json";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as BondOhmLusdContract } from "src/abi/bonds/OhmLusdContract.json";
import { abi as BondOhmEthContract } from "src/abi/bonds/OhmEthContract.json";
import { abi as BondTangibleNFT } from "src/abi/bonds/TangibleNFT.json";

import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOhmLusdContract } from "src/abi/reserves/OhmLusd.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "src/abi/reserves/OhmFrax.json";
import { abi as ReserveOhmEthContract } from "src/abi/reserves/OhmEth.json";
import { abi as ReserveTangibleNFT } from "src/abi/reserves/TangibleNFT.json";

import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { BigNumberish } from "ethers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mumbai]: false, [NetworkID.Polygon]: false },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mumbai]: {
      bondAddress: "0x3e3d07B91246D9BE667035557990dA0611F6aE83",
      reserveAddress: "0x52439209dc5f526375b8ab036ef9ea15bf0ce63b",
    },
    [NetworkID.Polygon]: {
      bondAddress: "0xFDAACD04f8ad605e928F4A44864FF825dCd4796d",
      reserveAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
  },
});

export const dai_v2 = new StableBond({
  name: "dai_v2",
  displayName: "DAI-V2",
  bondToken: "DAI-V2",
  isAvailable: { [NetworkID.Mumbai]: true, [NetworkID.Polygon]: true },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mumbai]: {
      bondAddress: "0x3e3d07B91246D9BE667035557990dA0611F6aE83",
      reserveAddress: "0x52439209dc5f526375b8ab036ef9ea15bf0ce63b",
    },
    [NetworkID.Polygon]: {
      bondAddress: "0xa9f53EdaEB43e83ED0d2f17555A5546bAE9E7097",
      reserveAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
  },
});

// export const frax = new StableBond({
//   name: "frax",
//   displayName: "FRAX",
//   bondToken: "FRAX",
//   isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
//   bondIconSvg: FraxImg,
//   bondContractABI: FraxBondContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0x8510c8c2B6891E04864fa196693D44E6B6ec2514",
//       reserveAddress: "0x853d955acef822db058eb8505911ed77f175b99e",
//     },
//     [NetworkID.Testnet]: {
//       bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
//       reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
//     },
//   },
// });

// export const lusd = new StableBond({
//   name: "lusd",
//   displayName: "LUSD",
//   bondToken: "LUSD",
//   isAvailable: { [NetworkID.Mainnet]: false, [NetworkID.Testnet]: true },
//   bondIconSvg: LusdImg,
//   bondContractABI: LusdBondContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0x10C0f93f64e3C8D0a1b0f4B87d6155fd9e89D08D",
//       reserveAddress: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
//     },
//     [NetworkID.Testnet]: {
//       bondAddress: "0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa",
//       reserveAddress: "0x45754dF05AA6305114004358eCf8D04FF3B84e26",
//     },
//   },
// });

// export const eth = new CustomBond({
//   name: "eth",
//   displayName: "wETH",
//   lpUrl: "",
//   bondType: BondType.StableAsset,
//   bondToken: "wETH",
//   isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
//   bondIconSvg: wETHImg,
//   bondContractABI: EthBondContract,
//   reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
//       reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//     },
//     [NetworkID.Testnet]: {
//       bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
//       reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
//     },
//   },
//   customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
//     const ethBondContract = this.getContractForBond(networkID, provider);
//     let ethPrice: BigNumberish = await ethBondContract.assetPrice();
//     ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
//     const token = this.getContractForReserve(networkID, provider);
//     let ethAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
//     ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
//     return ethAmount * ethPrice;
//   },
// });

export const guru_dai = new LPBond({
  name: "guru_dai_lp",
  displayName: "GURU-DAI LP",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mumbai]: false, [NetworkID.Polygon]: false },
  bondIconSvg: GuruDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mumbai]: {
      bondAddress: "0xfCD621d3Dda30568ebAAe3c89B73119A708fd55D",
      reserveAddress: "0xf86868748f973322e38152f75275777a34d8e3fd",
    },
    [NetworkID.Polygon]: {
      bondAddress: "0xbbA07bd5B20B63249398b831082ace6415afB7E0",
      reserveAddress: "0x7c9B16d845FE163F464d265193cC2B4eE3faC326",
    },
  },
  lpUrl: `https://app.sushi.com/add/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063/0x057E0bd9B797f9Eeeb8307B35DbC8c12E534c41E`,
});

export const guru_dai_v2 = new LPBond({
  name: "guru_dai_lp_v2",
  displayName: "GURU-DAI LP V2",
  bondToken: "GURU-DAI LP V2",
  isAvailable: { [NetworkID.Mumbai]: true, [NetworkID.Polygon]: true },
  bondIconSvg: GuruDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mumbai]: {
      bondAddress: "0xfCD621d3Dda30568ebAAe3c89B73119A708fd55D",
      reserveAddress: "0xf86868748f973322e38152f75275777a34d8e3fd",
    },
    [NetworkID.Polygon]: {
      bondAddress: "0x4Ff07D77E77075fefaDEBa36C53C2c759aFF8f60",
      reserveAddress: "0x7c9B16d845FE163F464d265193cC2B4eE3faC326",
    },
  },
  lpUrl: `https://app.sushi.com/add/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063/0x057E0bd9B797f9Eeeb8307B35DbC8c12E534c41E`,
});

// export const ohm_frax = new LPBond({
//   name: "ohm_frax_lp",
//   displayName: "GURU-FRAX LP",
//   bondToken: "FRAX",
//   isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
//   bondIconSvg: OhmFraxImg,
//   bondContractABI: FraxOhmBondContract,
//   reserveContract: ReserveOhmFraxContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0xc20CffF07076858a7e642E396180EC390E5A02f7",
//       reserveAddress: "0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877",
//     },
//     [NetworkID.Testnet]: {
//       bondAddress: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
//       reserveAddress: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
//     },
//   },
//   lpUrl:
//     "https://app.uniswap.org/#/add/v2/0x853d955acef822db058eb8505911ed77f175b99e/0x383518188c0c6d7730d91b2c03a03c837814a899",
// });

// export const ohm_lusd = new LPBond({
//   name: "ohm_lusd_lp",
//   displayName: "OHM-LUSD LP",
//   bondToken: "LUSD",
//   isAvailable: { [NetworkID.Mainnet]: false, [NetworkID.Testnet]: true },
//   bondIconSvg: GuruLusdImg,
//   bondContractABI: BondOhmLusdContract,
//   reserveContract: ReserveOhmLusdContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0xFB1776299E7804DD8016303Df9c07a65c80F67b6",
//       reserveAddress: "0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b",
//     },
//     [NetworkID.Testnet]: {
//       // NOTE (appleseed-lusd): using ohm-dai rinkeby contracts
//       bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
//       reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
//     },
//   },
//   lpUrl:
//     "https://app.sushi.com/add/0x383518188C0C6d7730D91b2c03a03C837814a899/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
// });

// export const ohm_weth = new CustomBond({
//   name: "ohm_weth_lp",
//   displayName: "Guru-WETH LP",
//   bondToken: "WETH",
//   isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
//   bondIconSvg: GuruEthImg,
//   bondContractABI: BondOhmEthContract,
//   reserveContract: ReserveOhmEthContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0xB6C9dc843dEc44Aa305217c2BbC58B44438B6E16",
//       reserveAddress: "0xfffae4a0f4ac251f4705717cd24cadccc9f33e06",
//     },
//     [NetworkID.Testnet]: {
//       // NOTE (unbanksy): using ohm-dai rinkeby contracts
//       bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
//       reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
//     },
//   },
//   bondType: BondType.LP,
//   lpUrl:
//     "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//   customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
//     if (networkID === NetworkID.Mainnet) {
//       const ethBondContract = this.getContractForBond(networkID, provider);
//       let ethPrice: BigNumberish = await ethBondContract.assetPrice();
//       ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
//       const token = this.getContractForReserve(networkID, provider);
//       const tokenAddress = this.getAddressForReserve(networkID);
//       const bondCalculator = getBondCalculator(networkID, provider);
//       const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
//       const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
//       const markdown = await bondCalculator.markdown(tokenAddress);
//       let tokenUSD =
//         (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
//       return tokenUSD * Number(ethPrice.toString());
//     } else {
//       // NOTE (appleseed): using OHM-DAI on rinkeby
//       const token = this.getContractForReserve(networkID, provider);
//       const tokenAddress = this.getAddressForReserve(networkID);
//       const bondCalculator = getBondCalculator(networkID, provider);
//       const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
//       const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
//       const markdown = await bondCalculator.markdown(tokenAddress);
//       let tokenUSD =
//         (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
//       return tokenUSD;
//     }
//   },
// });

export const gold100g = new GoldBond({
  name: "gold100g",
  displayName: "Gold Bar TNFT 100g",
  bondToken: "gold100g",
  isAvailable: { [NetworkID.Polygon]: true, [NetworkID.Mumbai]: true },
  bondIconSvg: GoldImg,
  bondContractABI: BondTangibleNFT,
  reserveContract: ReserveTangibleNFT,
  networkAddrs: {
    [NetworkID.Polygon]: {
      bondAddress: "0xB40063bfA84c33565CB59c127fBACAFBcc117b70",
      reserveAddress: "0x03332e2EB6458a9b6C481e71a27cD5Cac60A787F",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0xe520f3031F034950d977CaBd7a135BBd881fB74b",
      reserveAddress: "0xCa6673bfA54A155Ce8aff75303a4a5A4A005A466",
    },
  },
  bondCalcAddrs: {
    [NetworkID.Polygon]: "0xA8Fb6e78c7958ADC2F99F989587DEdF7e02723bE",
    [NetworkID.Mumbai]: "0xb7F6dCeBCD3BcC73771CAe8FbB26f19752ca321D",
  },
  bondType: BondType.Gold,
});

export const gold250g = new GoldBond({
  name: "gold250g",
  displayName: "Gold Bar TNFT 250g",
  bondToken: "gold250g",
  isAvailable: { [NetworkID.Polygon]: true, [NetworkID.Mumbai]: true },
  bondIconSvg: GoldImg,
  bondContractABI: BondTangibleNFT,
  reserveContract: ReserveTangibleNFT,
  networkAddrs: {
    [NetworkID.Polygon]: {
      bondAddress: "0x72d293b29FF5E493219239839613f62341A36113",
      reserveAddress: "0xA3f38a252a7Cbf475c908C59571D048F8b2FDfe3",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0x4aF173C0F80AfC015d20078AD605df0076a1c0c5",
      reserveAddress: "0x6C43F23FE49D6a4c636EFD41B32757C35039bd20",
    },
  },
  bondCalcAddrs: {
    [NetworkID.Polygon]: "0xFc8F9B80D6290FC22DD2ECdC6065fC10eC39e1E7",
    [NetworkID.Mumbai]: "0xD6F7324D6A155E7EF685A2C3E7463F30D496d93F",
  },
  bondType: BondType.Gold,
});

export const gold500g = new GoldBond({
  name: "gold500g",
  displayName: "Gold Bar TNFT 500g",
  bondToken: "gold500g",
  isAvailable: { [NetworkID.Polygon]: true, [NetworkID.Mumbai]: true },
  bondIconSvg: GoldImg,
  bondContractABI: BondTangibleNFT,
  reserveContract: ReserveTangibleNFT,
  networkAddrs: {
    [NetworkID.Polygon]: {
      bondAddress: "0x2466c63418432b14C0D45fC803fCEB795783EC36",
      reserveAddress: "0xcf52035528D521bD44C7777eFd20E6d44d1A8dfd",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0x0483d79fD914A4Ee54Fa425FB5CD180087D68f4c",
      reserveAddress: "0xe0Fc6FC070A165F827A3A4bd5b43b6a283108Eb8",
    },
  },
  bondCalcAddrs: {
    [NetworkID.Polygon]: "0x4CcB0f4729FF5bDbc4A5e1f4cE02EFFe229CDc8b",
    [NetworkID.Mumbai]: "0x0527A911E6Ea73CcE4B444A97b73b5A1b917d41E",
  },
  bondType: BondType.Gold,
});

export const gold1000g = new GoldBond({
  name: "gold1000g",
  displayName: "Gold Bar TNFT 1000g",
  bondToken: "gold1000g",
  isAvailable: { [NetworkID.Polygon]: true, [NetworkID.Mumbai]: true },
  bondIconSvg: GoldImg,
  bondContractABI: BondTangibleNFT,
  reserveContract: ReserveTangibleNFT,
  networkAddrs: {
    [NetworkID.Polygon]: {
      bondAddress: "0x95b59BD77fCe9E90B959D6425138ABc865c1852d",
      reserveAddress: "0x3f09529320f8128787c9c4157A971D0c0D421367",
    },
    [NetworkID.Mumbai]: {
      bondAddress: "0x9199Bc45c1C4C3A7aFf8eDD77160350eDc3bcAce",
      reserveAddress: "0x9F4e04e447b693f0bAc1C88F960a547F7b944845",
    },
  },
  bondCalcAddrs: {
    [NetworkID.Polygon]: "0x70d14a888AB512530Fb21b065f60d0F48D4Cc0bc",
    [NetworkID.Mumbai]: "0xcC718D5Dd4b878De7C4e9fb2DfA3dFAc1a61ba65",
  },
  bondType: BondType.Gold,
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [dai_v2, guru_dai_v2, dai, guru_dai];
export const allRealBonds = [gold100g, gold250g, gold500g, gold1000g];
export const allRealBondsMap = allRealBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});
export const allBondsMap = allBonds
  .filter(bond => bond.name.indexOf("v2") >= 0)
  .reduce((prevVal, bond) => {
    return { ...prevVal, [bond.name]: bond };
  }, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
