import { ethers } from "ethers";
import React from "react";
import { addresses } from "src/constants";
import { useWeb3Context } from "src/hooks";
import PassiveIncomeNFT from "../../abi/PassiveIncomeNFT.json";
import { useDispatch } from "react-redux";
import { error } from "src/slices/MessagesSlice";

function useApprovedForAll() {
  const { address, provider, chainID } = useWeb3Context();
  const [isApprovedForAll, setIsApprovedForAll] = React.useState<boolean>(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    async function getIsApprovedForAll() {
      if (provider && chainID) {
        try {
          const nidhiLegacyNFTContract = new ethers.Contract(
            addresses[chainID].PASSIVE_INCOME_NFT,
            PassiveIncomeNFT,
            provider,
          );

          const _isApprovedForAll = await nidhiLegacyNFTContract.isApprovedForAll(
            address,
            addresses[chainID].PASSIVE_INCOME_NFT_SWAP,
          );

          setIsApprovedForAll(_isApprovedForAll);
        } catch (err: any) {
          dispatch(error(err.message));
          console.log("err", err);
        }
      }
    }

    getIsApprovedForAll();
  }, [address, chainID, provider]);

  return [isApprovedForAll, setIsApprovedForAll] as const;
}

export default useApprovedForAll;
