import React from "react";
import { useDispatch } from "react-redux";
import { BigNumberish, ethers } from "ethers";
import { useWeb3Context } from "src/hooks/web3Context";
import NidhiMarket from "../abi/NidhiMarket.json";
import NidhiNFT from "../abi/NidhiNFT.json";
import { error } from "src/slices/MessagesSlice";
import getPrice from "./getPrice";
import { addresses } from "src/constants";

export interface NFT {
  itemId: BigNumberish;
  tokenId: BigNumberish;
  name: string;
  img: string;
  price: BigNumberish;
  totalValue: BigNumberish;
  description: string;
  formattedPrice: string;
  usdcPrice: string;
}

const useUserNFTs = (): NFT[] => {
  const isFetching = React.useRef(false);
  const [nfts, setNfts] = React.useState<Array<NFT>>([]);
  const { address, chainID, provider } = useWeb3Context();
  const signer = provider.getSigner();
  const dispatch = useDispatch();

  const marketContract = React.useMemo(() => {
    if (signer) {
      return new ethers.Contract(NidhiMarket.address, NidhiMarket.abi, signer);
    }
  }, [signer]);

  const tokenContract = React.useMemo(() => {
    if (provider) {
      return new ethers.Contract(NidhiNFT.address, NidhiNFT.abi, provider);
    }
  }, [provider]);

  React.useEffect(() => {
    try {
      (async function () {
        if (marketContract && tokenContract && !nfts.length && !isFetching.current) {
          isFetching.current = true;
          const items = await marketContract.fetchItemsByOwner(address, 0, 10, false);

          const _nfts: any = await Promise.all(
            items.map(async (item: any) => {
              const meta = await tokenContract.metadata(item.tokenId.toNumber());

              const formattedPrice = ethers.utils.formatUnits(item.price, "gwei");

              let usdcPrice = formattedPrice;

              if (item.price.toNumber() > 0) {
                usdcPrice = await getPrice({
                  addressIn: addresses[chainID].TANGIBLE_ADDRESS,
                  addressOut: addresses[chainID].USDC_ADDRESS,
                  tokenAmount: formattedPrice,
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
                formattedPrice,
                usdcPrice,
              };

              return nft;
            }),
          );

          setNfts(_nfts);
          isFetching.current = false;
        }
      })();
    } catch (err) {
      console.log("error", err);
      dispatch(error("There was an error approving the transaction, please try again"));
    }
  }, [nfts, address, chainID, marketContract, tokenContract]);

  return nfts;
};

export default useUserNFTs;
