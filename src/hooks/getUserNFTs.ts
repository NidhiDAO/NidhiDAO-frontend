import { BigNumberish, ethers } from "ethers";
import React from "react";
import { useWeb3Context } from "src/hooks";
import NidhiMarket from "../abi/NidhiMarket.json";
import NidhiNFT from "../abi/NidhiNFT.json";

// type Props = {};

export interface NFT {
  itemId: BigNumberish;
  tokenId: BigNumberish;
  name: string;
  img: string;
  price: BigNumberish;
  totalValue: BigNumberish;
  description: string;
}

const getUserNfts = (): NFT[] => {
  const isFetching = React.useRef(false);
  const [nfts, setNfts] = React.useState<Array<NFT>>([]);
  const { address, provider } = useWeb3Context();
  const signer = provider.getSigner();

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
    (async function () {
      if (marketContract && tokenContract && !nfts.length && !isFetching.current) {
        isFetching.current = true;
        const items = await marketContract.fetchItemsByOwner(address, 0, 10, false);

        const _nfts: any = await Promise.all(
          items.map(async (item: any) => {
            const meta = await tokenContract.metadata(item.tokenId.toNumber());
            console.log("item", item);
            const img = `https://infura-ipfs.io/ipfs/${meta?.image}`;
            const nft = {
              itemId: item.itemId,
              tokenId: item.tokenId,
              name: meta.name,
              img,
              price: item.price,
              totalValue: item.totalValue,
              description: item.description,
            };

            return nft;
          }),
        );

        console.log("nfts", _nfts);
        setNfts(_nfts);
        isFetching.current = false;
      }
    })();
  }, [nfts, address, marketContract, tokenContract]);

  return nfts;
};

export default getUserNfts;
