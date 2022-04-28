import React, { useState, useEffect } from "react";
import { BigNumber, ethers, utils } from "ethers";

import { addresses } from "src/constants";
import { useWeb3Context } from "src/hooks";
import PassiveIncomeNft from "src/abi/PassiveIncomeNFT.json";
import PassiveIncomeCalc from "src/abi/PassiveIncomeCalculator.json";

export const minLockDuration = 24;

type MultiplierLabel = `${string}x (${string} months)`;

interface MultiplierOption {
  label: MultiplierLabel;
  value: number;
}

interface UseMultiplierOptions {
  dropdownOptions: MultiplierOption[];
  isLoading: boolean;
}

const getLockRangeMonths = (maxLockInMonths: number) =>
  Array.from(Array(maxLockInMonths + (maxLockInMonths === minLockDuration ? 1 : 2)).keys()).slice(
    24,
    maxLockInMonths + 1,
  );

const useMultiplierOptions = (): UseMultiplierOptions => {
  const { chainID, provider } = useWeb3Context();

  const [dropdownOptions, setDropdownOptions] = useState<MultiplierOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleGetDropdownInfo = async () => {
      try {
        setIsLoading(true);

        const signer = provider.getSigner();
        const { PASSIVE_INCOME_NFT, PASSIVE_INCOME_CALC } = addresses[chainID];

        const piNFtContract = new ethers.Contract(PASSIVE_INCOME_NFT, PassiveIncomeNft, signer);
        const piCalcContract = new ethers.Contract(PASSIVE_INCOME_CALC, PassiveIncomeCalc, signer);

        const boostStartTime = Number(await piNFtContract.boostStartTime());
        const boostEndTime = Number(await piNFtContract.boostEndTime());
        const maxLockDuration = Number(await piNFtContract.maxLockDuration());

        const lockRangeInMonths = getLockRangeMonths(maxLockDuration);
        const multipliers: BigNumber[] = await piCalcContract.determineMultipliers(
          boostStartTime,
          boostEndTime,
          Math.round(+new Date() / 1000),
          lockRangeInMonths,
        );

        const options: MultiplierOption[] = multipliers
          .map(multiplier => +utils.formatUnits(multiplier, 18))
          .reduce((acc, multiplier, index) => {
            const month = lockRangeInMonths[index];

            acc.push({
              value: month,
              label: `${multiplier.toFixed(2)}x (${month} months)`,
            });

            return acc;
          }, [] as MultiplierOption[]);

        setDropdownOptions(options);
      } catch (err) {
        // @TODO: Handle error
      } finally {
        setIsLoading(false);
      }
    };

    if (chainID && provider) {
      handleGetDropdownInfo();
    }
  }, [chainID, provider]);

  return {
    dropdownOptions,
    isLoading,
  };
};

export default useMultiplierOptions;
