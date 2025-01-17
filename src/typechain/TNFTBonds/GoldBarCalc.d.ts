/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface GoldBarCalcInterface extends utils.Interface {
  functions: {
    "BondDepo()": FunctionFragment;
    "GURU()": FunctionFragment;
    "GURUDAI()": FunctionFragment;
    "goldAmounts(address)": FunctionFragment;
    "valuation()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "BondDepo", values?: undefined): string;
  encodeFunctionData(functionFragment: "GURU", values?: undefined): string;
  encodeFunctionData(functionFragment: "GURUDAI", values?: undefined): string;
  encodeFunctionData(functionFragment: "goldAmounts", values: [string]): string;
  encodeFunctionData(functionFragment: "valuation", values?: undefined): string;

  decodeFunctionResult(functionFragment: "BondDepo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "GURU", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "GURUDAI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "goldAmounts", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "valuation", data: BytesLike): Result;

  events: {};
}

export interface GoldBarCalc extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GoldBarCalcInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    BondDepo(overrides?: CallOverrides): Promise<[string]>;

    GURU(overrides?: CallOverrides): Promise<[string]>;

    GURUDAI(overrides?: CallOverrides): Promise<[string]>;

    goldAmounts(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    valuation(overrides?: CallOverrides): Promise<[BigNumber] & { _value: BigNumber }>;
  };

  BondDepo(overrides?: CallOverrides): Promise<string>;

  GURU(overrides?: CallOverrides): Promise<string>;

  GURUDAI(overrides?: CallOverrides): Promise<string>;

  goldAmounts(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  valuation(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    BondDepo(overrides?: CallOverrides): Promise<string>;

    GURU(overrides?: CallOverrides): Promise<string>;

    GURUDAI(overrides?: CallOverrides): Promise<string>;

    goldAmounts(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    valuation(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    BondDepo(overrides?: CallOverrides): Promise<BigNumber>;

    GURU(overrides?: CallOverrides): Promise<BigNumber>;

    GURUDAI(overrides?: CallOverrides): Promise<BigNumber>;

    goldAmounts(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    valuation(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    BondDepo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    GURU(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    GURUDAI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    goldAmounts(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    valuation(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
