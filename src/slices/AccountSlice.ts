import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { BondType } from "../lib/Bond";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk, ITNFT } from "./interfaces";
import { IERC20, PairContract, SOhmv2, WsOHM } from "src/typechain";
import { TangibleNFT } from "src/typechain/Tangible";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let ohmBalance = BigNumber.from(0);
    let sohmBalance = BigNumber.from(0);
    let wsohmBalance = BigNumber.from(0);
    let wsohmAsSohm = BigNumber.from(0);
    let poolBalance = BigNumber.from(0);
    let aguruBalance = BigNumber.from(0);

    if (addresses[networkID].GURU_ADDRESS) {
      const ohmContract = new ethers.Contract(
        addresses[networkID].GURU_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      ohmBalance = await ohmContract.balanceOf(address);
    }

    if (addresses[networkID].SGURU_ADDRESS) {
      const sohmContract = new ethers.Contract(
        addresses[networkID].SGURU_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      sohmBalance = await sohmContract.balanceOf(address);
    }

    if (addresses[networkID].WSGURU_ADDRESS) {
      const wsohmContract = new ethers.Contract(
        addresses[networkID].WSGURU_ADDRESS as string,
        wsOHM,
        provider,
      ) as WsOHM;
      wsohmBalance = await wsohmContract.balanceOf(address);
      // NOTE (appleseed): wsohmAsSohm is wsOHM given as a quantity of sOHM
      wsohmAsSohm = await wsohmContract.wOHMTosOHM(wsohmBalance);
    }

    if (addresses[networkID].PT_TOKEN_ADDRESS) {
      const poolTokenContract = new ethers.Contract(
        addresses[networkID].PT_TOKEN_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      poolBalance = await poolTokenContract.balanceOf(address);
    }

    if (addresses[networkID].AGURU_ADDRESS) {
      const aguruContract = new ethers.Contract(
        addresses[networkID].AGURU_ADDRESS as string,
        sOHMv2,
        provider,
      ) as SOhmv2;
      aguruBalance = await aguruContract.balanceOf(address);
    }

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        wsohm: ethers.utils.formatEther(wsohmBalance),
        wsohmAsSohm: ethers.utils.formatUnits(wsohmAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        aguru: ethers.utils.formatUnits(aguruBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  balances: {
    dai: string;
    ohm: string;
    sohm: string;
    wsohm: string;
    wsohmAsSohm: string;
  };
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  wrapping: {
    sohmWrap: number;
    wsohmUnwrap: number;
  };
  bonding: {
    daiAllowance: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmBalance = BigNumber.from(0);
    let sohmBalance = BigNumber.from(0);
    let fsohmBalance = BigNumber.from(0);
    let fsohmString = "0.0";
    let wsohmBalance = BigNumber.from(0);
    let wsohmAsSohm = BigNumber.from(0);
    let wrapAllowance = BigNumber.from(0);
    let unwrapAllowance = BigNumber.from(0);
    let stakeAllowance = BigNumber.from(0);
    let unstakeAllowance = BigNumber.from(0);
    let aguruAllowance = BigNumber.from(0);
    let aguruBalance = BigNumber.from(0);
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOHMAbleToClaim = 0;
    let poolBalance = BigNumber.from(0);
    let poolAllowance = BigNumber.from(0);
    let piNftSwapAllowance = BigNumber.from(0);

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const daiBalance = await daiContract.balanceOf(address);

    if (addresses[networkID].GURU_ADDRESS) {
      const ohmContract = new ethers.Contract(
        addresses[networkID].GURU_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      ohmBalance = await ohmContract.balanceOf(address);
      piNftSwapAllowance = await ohmContract.allowance(address, addresses[networkID].PASSIVE_INCOME_NFT_SWAP);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }

    if (addresses[networkID].SGURU_ADDRESS) {
      const sohmContract = new ethers.Contract(
        addresses[networkID].SGURU_ADDRESS as string,
        sOHMv2,
        provider,
      ) as SOhmv2;
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      // poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      // wrapAllowance = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    }

    if (addresses[networkID].AGURU_ADDRESS) {
      const aguruContract = new ethers.Contract(
        addresses[networkID].AGURU_ADDRESS as string,
        sOHMv2,
        provider,
      ) as SOhmv2;
      aguruBalance = await aguruContract.balanceOf(address);
      aguruAllowance = await aguruContract.allowance(address, addresses[networkID].CLAIM_ADDRESS);
    }

    // if (addresses[networkID].PT_TOKEN_ADDRESS) {
    //   const poolTokenContract = new ethers.Contract(
    //     addresses[networkID].PT_TOKEN_ADDRESS,
    //     ierc20Abi,
    //     provider,
    //   ) as IERC20;
    //   poolBalance = await poolTokenContract.balanceOf(address);
    // }

    // for (const fuseAddressKey of ["FUSE_6_SOHM", "FUSE_18_SOHM"]) {
    //   if (addresses[networkID][fuseAddressKey]) {
    //     const fsohmContract = new ethers.Contract(
    //       addresses[networkID][fuseAddressKey] as string,
    //       fuseProxy,
    //       provider.getSigner(),
    //     ) as FuseProxy;
    //     // fsohmContract.signer;
    //     const balanceOfUnderlying = await fsohmContract.callStatic.balanceOfUnderlying(address);
    //     fsohmBalance = balanceOfUnderlying.add(fsohmBalance);
    //   }
    // }

    // if (addresses[networkID].WSGURU_ADDRESS) {
    //   const wsohmContract = new ethers.Contract(
    //     addresses[networkID].WSGURU_ADDRESS as string,
    //     wsOHM,
    //     provider,
    //   ) as WsOHM;
    //   wsohmBalance = await wsohmContract.balanceOf(address);
    //   // NOTE (appleseed): wsohmAsSohm is used to calc your next reward amount
    //   wsohmAsSohm = await wsohmContract.wOHMTosOHM(wsohmBalance);
    //   unwrapAllowance = await wsohmContract.allowance(address, addresses[networkID].WSGURU_ADDRESS);
    // }

    return {
      balances: {
        bebo: ohmBalance,
        dai: ethers.utils.formatEther(daiBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: ethers.utils.formatUnits(fsohmBalance, "gwei"),
        wsohm: ethers.utils.formatEther(wsohmBalance),
        wsohmAsSohm: ethers.utils.formatUnits(wsohmAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        aguru: ethers.utils.formatUnits(aguruBalance, "gwei"),
      },
      allowances: {
        piNftSwapAllowance,
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      claim: {
        aguruAllowance: aguruAllowance,
      },
      wrapping: {
        ohmWrap: +wrapAllowance,
        ohmUnwrap: +unwrapAllowance,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
      pooling: {
        sohmPool: +poolAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
  tangibleNFTs: ITNFT[];
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
        tangibleNFTs: [],
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    console.log("bondDetails.payout.toString()", bondDetails.payout.toString());
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = BigNumber.from(0),
      balanceVal = ethers.utils.formatEther(balance),
      reserveContract: PairContract | TangibleNFT,
      tangibleNFTs: ITNFT[] = [];

    if (bond.type === BondType.Gold) {
      try {
        reserveContract = bond.getContractForReserve(networkID, provider) as TangibleNFT;
        console.log("reserveContract", reserveContract);
        allowance = BigNumber.from(10000000);
        balance = await reserveContract.balanceOf(address);
        console.log("user balance", balance);
        balanceVal = balance.toString();

        const nftPromises: Array<Promise<void>> = [];
        for (let i = 0; i < Number(balanceVal); i++) {
          const nftPromise = new Promise<void>(async resolve => {
            try {
              const tokenId = await (reserveContract as TangibleNFT).tokenOfOwnerByIndex(address, i);
              const [uri, brand, storageEndTimeInSeconds] = await Promise.all([
                (reserveContract as TangibleNFT).tokenURI(tokenId),
                (reserveContract as TangibleNFT).tokenBrand(tokenId),
                (reserveContract as TangibleNFT).storageEndTime(tokenId),
              ]);

              const tnft = {
                tokenId,
                uri,
                brand,
                storageEndTimeInSeconds,
              } as ITNFT;
              tangibleNFTs.push(tnft);
            } catch (error) {
              console.log("Error in fetching NFTs");
              console.log(error);
            } finally {
              resolve();
            }
          });

          nftPromises.push(nftPromise);
        }

        await Promise.all(nftPromises);
      } catch (error) {
        console.error(`Error getting allowance and/or balance for bond type ${bond.type}`);
        console.error(error);
      }
    } else {
      try {
        reserveContract = bond.getContractForReserve(networkID, provider) as PairContract;
        allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
        balance = await reserveContract.balanceOf(address);
        balanceVal = ethers.utils.formatEther(balance);
      } catch (error) {
        console.error(`Error getting allowance and/or balance for bond type ${bond.type}`);
      }
    }

    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance && allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
      tangibleNFTs,
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ohm: string;
    sohm: string;
    dai: string;
    oldsohm: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
