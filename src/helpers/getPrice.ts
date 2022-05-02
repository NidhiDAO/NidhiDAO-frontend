import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import UniSwap from "src/abi/UniswapV2Router02.json";

interface IgetPrice {
  addressIn: string;
  addressOut: string;
  provider: StaticJsonRpcProvider;
  chainID?: number;
  tokenAmount: string;
}

async function getPrice({ addressIn, addressOut, provider, tokenAmount }: IgetPrice) {
  try {
    const uniswapContract = new ethers.Contract(UniSwap.address, UniSwap.abi, provider);

    const estimatedPrice = await uniswapContract.getAmountsOut(ethers.utils.parseUnits(tokenAmount, 18), [
      addressIn,
      addressOut,
    ]);

    const [, estimatedUsdcPrice] = estimatedPrice;
    const conversionInfoText = localizeNumber(ethers.utils.formatUnits(estimatedUsdcPrice, 6));

    return conversionInfoText;
  } catch (err) {
    console.error("error", err);
    return "";
  }
}

const localizeNumber = (value: any) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });

export default getPrice;
