import React from "react";
import { ethers } from "ethers";

import { addresses } from "src/constants";
import { useWeb3Context } from "src/hooks";
import PassiveIncomeNFT from "src/abi/PassiveIncomeNFT.json";

export const MIN_LOCK_DURATION = 24;

function useLockOptions() {
  const [lockOptions, setLockOptions] = React.useState<Array<{ name: string; value: number }>>([]);
  const { provider, chainID } = useWeb3Context();

  React.useEffect(() => {
    if (chainID && provider) {
      (async function () {
        try {
          const options = [];
          const contract = new ethers.Contract(
            addresses[chainID].PASSIVE_INCOME_NFT,
            PassiveIncomeNFT,
            provider.getSigner(),
          );
          const maxLockDuration = await contract.maxLockDuration();

          for (let index = Number(MIN_LOCK_DURATION); index <= maxLockDuration; index++) {
            options.push({ name: `${index} months`, value: index });
          }

          setLockOptions(options);
        } catch (err) {
          console.log("err", err);
        }
      })();
    }
  }, [provider, chainID]);

  return lockOptions;
}

export default useLockOptions;
