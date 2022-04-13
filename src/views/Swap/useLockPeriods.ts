import { ethers } from "ethers";
import React from "react";
import { addresses } from "src/constants";
import { useWeb3Context } from "src/hooks";
import PassiveIncomeCalculator from "../../abi/PassiveIncomeCalculator.json";
import PassiveIncomeNFT from "../../abi/PassiveIncomeNFT.json";
import PassiveIncomeNFTSwap from "../../abi/PassiveIncomeNFTSwap.json";

function useGetLockPeriods() {
  const [lockPeriods, setLockPeriods] = React.useState<Array<{ name: string; value: number }>>([]);
  const { address, chainID, provider } = useWeb3Context();

  React.useEffect(() => {
    async function getLockPeriods() {
      if (provider && address) {
        try {
          const passiveIncomeCalculatorContract = new ethers.Contract(
            addresses[chainID].PASSIVE_INCOME_CALCULATOR,
            PassiveIncomeCalculator,
            provider,
          );

          const passiveIncomeNFTContract = new ethers.Contract(
            addresses[chainID].PASSIVE_INCOME_NFT,
            PassiveIncomeNFT,
            provider,
          );

          const passiveIncomeNFTSwapContract = new ethers.Contract(
            addresses[chainID].PASSIVE_INCOME_NFT_SWAP,
            PassiveIncomeNFTSwap,
            provider,
          );

          const [start, end, maxLockDuration, minLockDuration] = await Promise.all([
            await passiveIncomeNFTContract.boostStartTime(),
            await passiveIncomeNFTContract.boostEndTime(),
            await passiveIncomeNFTContract.maxLockDuration(),
            await passiveIncomeNFTSwapContract.minLockDuration(),
          ]);

          const timeStamp = Math.round(+new Date() / 1000);

          const multipliers = await passiveIncomeCalculatorContract.determineMultipliers(start, end, timeStamp, [
            minLockDuration,
            maxLockDuration,
          ]);

          const _lockPeriods = multipliers.map((multiplier: any) => {
            const lockPeriod = Number(ethers.utils.formatEther(multiplier));

            return { name: `${lockPeriod} month(s)`, value: lockPeriod };
          });

          setLockPeriods(_lockPeriods);
        } catch (error) {
          console.error(error);
        }
      }
    }

    getLockPeriods();
  }, []);

  return lockPeriods;
}

export default useGetLockPeriods;
