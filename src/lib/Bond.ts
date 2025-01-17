import { StaticJsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { BondCalcContract, EthContract, PairContract } from "src/typechain";
import { addresses } from "src/constants";
import React from "react";
import { TangibleNFT } from "src/typechain/Tangible";
import { GoldBarBond, GoldBarCalc } from "src/typechain/TNFTBonds";
import { abi as GoldBondCalcABI } from "../abi/GoldBondCalcContract.json";

export enum NetworkID {
  Mumbai = 80001,
  Polygon = 137,
}

export enum BondType {
  StableAsset,
  LP,
  Gold,
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  [NetworkID.Mumbai]: BondAddresses;
  [NetworkID.Polygon]: BondAddresses;
}

export interface BondCalculatorAddresses {
  [NetworkID.Mumbai]: string;
  [NetworkID.Polygon]: string;
}

export interface Available {
  [NetworkID.Mumbai]?: boolean;
  [NetworkID.Polygon]?: boolean;
}

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  isAvailable: Available; // set false to hide
  bondIconSvg: React.ReactNode; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly type: BondType;
  readonly isAvailable: Available;
  readonly bondIconSvg: React.ReactNode;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: Boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;

  // Async method that returns a Promise
  abstract getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number>;

  constructor(type: BondType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.type = type;
    this.isAvailable = bondOpts.isAvailable;
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.bondToken = bondOpts.bondToken;
  }

  /**
   * makes isAvailable accessible within Bonds.ts
   * @param networkID
   * @returns boolean
   */
  getAvailability(networkID: NetworkID) {
    return this.isAvailable[networkID];
  }

  getAddressForBond(networkID: NetworkID) {
    return this.networkAddrs[networkID].bondAddress;
  }
  getContractForBond(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(networkID);
    return new ethers.Contract(bondAddress, this.bondContractABI, provider) as EthContract | GoldBarBond;
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkAddrs[networkID]?.reserveAddress;
  }
  getContractForReserve(
    networkID: NetworkID,
    provider: StaticJsonRpcProvider | JsonRpcSigner,
  ): PairContract | TangibleNFT {
    const bondAddress = this.getAddressForReserve(networkID);
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as PairContract | TangibleNFT;
  }

  // async getBondReservePrice(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
  //   const pairContract = this.getContractForReserve(networkID, provider);
  //   const reserves = await pairContract.getReserves();
  //   const marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
  //   return marketPrice;
  // }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string;
}

export class LPBond extends Bond {
  readonly isLP = true;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(lpBondOpts: LPBondOpts) {
    super(BondType.LP, lpBondOpts);

    this.lpUrl = lpBondOpts.lpUrl;
    this.reserveContract = lpBondOpts.reserveContract;
    this.displayUnits = "LP";
  }
  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    const token = this.getContractForReserve(networkID, provider);
    const tokenAddress = this.getAddressForReserve(networkID);
    const bondCalculator = getBondCalculator(networkID, provider);
    const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
    const markdown = await bondCalculator.markdown(tokenAddress);
    console.debug("markdown:", markdown.toString());
    let tokenUSD = (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
    return Number(tokenUSD.toString());
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export interface StableBondOpts extends BondOpts {}
export class StableBond extends Bond {
  readonly isLP = false;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondType.StableAsset, stableBondOpts);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.displayName;
    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }

  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    let token = this.getContractForReserve(networkID, provider);
    let tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    return Number(tokenAmount.toString()) / Math.pow(10, 18);
  }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  bondType: number;
  lpUrl: string;
  customTreasuryBalanceFunc: (
    this: CustomBond,
    networkID: NetworkID,
    provider: StaticJsonRpcProvider,
  ) => Promise<number>;
}
export class CustomBond extends Bond {
  readonly isLP: Boolean;
  getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number> {
    throw new Error("Method not implemented.");
  }
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  readonly lpUrl: string;

  constructor(customBondOpts: CustomBondOpts) {
    super(customBondOpts.bondType, customBondOpts);

    if (customBondOpts.bondType === BondType.LP) {
      this.isLP = true;
    } else {
      this.isLP = false;
    }
    this.lpUrl = customBondOpts.lpUrl;
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOpts.displayName;
    this.reserveContract = customBondOpts.reserveContract;
    this.getTreasuryBalance = customBondOpts.customTreasuryBalanceFunc.bind(this);
  }
}

export interface GoldBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  bondType: number;
  bondCalcAddrs: BondCalculatorAddresses;
}

export class GoldBond extends Bond {
  readonly isLP: Boolean;
  readonly bondCalcAddrs: BondCalculatorAddresses;
  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkID);
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as TangibleNFT;
  }
  getContractForCalculator(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const calcAddress = this.bondCalcAddrs[networkID];
    return new ethers.Contract(calcAddress, GoldBondCalcABI, provider) as GoldBarCalc;
  }
  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    try {
      const token = this.getContractForReserve(networkID, provider);
      const bondContract = this.getContractForBond(networkID, provider);
      console.debug("bondContract:", bondContract);
      const assetPrice = await bondContract.assetPrice();
      console.debug("assetPrice:", assetPrice.toString());
      const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

      let tokenUSD = (Number(assetPrice.toString()) * Number(tokenAmount.toString())) / Math.pow(10, 8);
      return Number(tokenUSD.toString());
    } catch (error) {
      console.log("error tb");
      console.log(error);
      return 0;
    }
  }
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(goldBondOpts: GoldBondOpts) {
    super(goldBondOpts.bondType, goldBondOpts);

    this.isLP = false;
    this.displayUnits = goldBondOpts.displayName;
    this.reserveContract = goldBondOpts.reserveContract;
    this.bondCalcAddrs = goldBondOpts.bondCalcAddrs;
    // this.getTreasuryBalance = goldBondOpts.customTreasuryBalanceFunc.bind(this);
  }
}
