import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { useWeb3Context } from "src/hooks/web3Context";
import NidhiMarketplace from "../abi/NidhiMarketplace.json";
import NidhiNFT from "../abi/NidhiNFT.json";
import { error as errorAction } from "src/slices/MessagesSlice";
import getPrice from "./getPrice";
import { addresses } from "src/constants";

const localizeNumber = (value: string) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });

export interface NFT {
  itemId: BigNumberish;
  tokenId: BigNumberish;
  name: string;
  img: string;
  price: BigNumberish;
  totalValue: BigNumberish;
  description: string;
  tokenAmount: string;
  usdcPrice: string;
}

const useUserNFTs = (): NFT[] => {
  const { address, chainID, provider } = useWeb3Context();

  const dispatch = useDispatch();

  const isFetching = useRef(false);

  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    const handleGetUserNfts = async () => {
      try {
        const signer = provider.getSigner();
        const { NIDHI_MARKETPLACE, TANGIBLE_ADDRESS, USDC_ADDRESS, NIDHI_NFT } = addresses[chainID];

        const marketContract = new ethers.Contract(NIDHI_MARKETPLACE, NidhiMarketplace, signer);
        const tokenContract = new ethers.Contract(NIDHI_NFT, NidhiNFT, provider);

        isFetching.current = true;
        const items = await marketContract.fetchItemsByOwner(address, 0, 10, false);

        const _nfts: any = await Promise.all(
          items.map(async (item: any) => {
            const meta = await tokenContract.metadata(item.tokenId.toNumber());

            const intrinsicValue: BigNumber = await marketContract.intrinsicValue(item.itemId);
            const redeemable: BigNumber = await marketContract.redeemable(item.itemId);

            const tokenAmountBig = intrinsicValue.add(redeemable);
            const tokenAmount = ethers.utils.formatUnits(tokenAmountBig, "gwei");

            let usdcPrice = tokenAmount;
            if (tokenAmountBig.toNumber() > 0) {
              usdcPrice = await getPrice({
                addressIn: TANGIBLE_ADDRESS,
                addressOut: USDC_ADDRESS,
                tokenAmount,
                provider,
              });
            }

            const img = `https://infura-ipfs.io/ipfs/${meta?.image}`;
            const nft = {
              itemId: item.itemId,
              tokenId: item.tokenId,
              name: meta.name,
              img,
              price: item.price,
              totalValue: item.totalValue,
              description: item.description,
              tokenAmount: localizeNumber(tokenAmount),
              usdcPrice,
            };

            return nft;
          }),
        );

        setNfts(_nfts);
        isFetching.current = false;
      } catch (error) {
        dispatch(errorAction("There was an error approving the transaction, please try again"));
      }
    };

    if (address && chainID && provider && !isFetching.current) {
      handleGetUserNfts();
    }
  }, [address, chainID, provider]);

  return nfts;
};

export default useUserNFTs;
