import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds from "src/helpers/AllBonds";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";

// TODO REPLACE TO ANOTHER FILE AFTER REMOVING THE MOCK
import { ReactComponent as GoldImg } from "src/assets/tokens/GOLD.svg";
import { ReactComponent as FineWineImg } from "src/assets/tokens/WINE.svg";
import { ReactComponent as RealEstateImg } from "src/assets/tokens/ESTATE.svg";
import { ReactComponent as ArtImg } from "src/assets/tokens/ART.svg";

interface IBondingStateView {
  account: {
    bonds: {
      [key: string]: IUserBondDetails;
    };
  };
  bonding: {
    loading: Boolean;
    [key: string]: any;
  };
}

// Smash all the interfaces together to get the BondData Type
interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {}

const initialBondArray = allBonds;
// Slaps together bond data within the account & bonding states
function useBonds(chainID: number) {
  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const accountBondsState = useSelector((state: IBondingStateView) => state.account.bonds);
  const [bonds, setBonds] = useState<Bond[] | IAllBondData[]>(initialBondArray);
  const [realBonds, setRealBonds] = useState();

  // TODO set Bond with real  world assets instead of mock:

  const realBondsMock = [
    {
      bondContractABI: [],
      bondIconSvg: GoldImg,
      bondToken: "GOLD",
      displayName: "GOLD",
      displayUnits: "LP",
      isAvailable: false,
      isLP: false,
      lpUrl: "",
      name: "gold",
      networkAddrs: {},
      reserveContract: [],
      bondDiscount: "Coming soon",
      type: 1,
      price: "-",
    },
    {
      bondContractABI: [],
      bondIconSvg: FineWineImg,
      bondToken: "FINE WINE",
      displayName: "FINE WINE",
      displayUnits: "LP",
      isAvailable: false,
      isLP: false,
      lpUrl: "",
      name: "fine_wine",
      networkAddrs: {},
      reserveContract: [],
      bondDiscount: "Coming soon",
      type: 1,
      price: "-",
    },
    {
      bondContractABI: [],
      bondIconSvg: RealEstateImg,
      bondToken: "REAL ESTATE",
      displayName: "REAL ESTATE",
      displayUnits: "LP",
      isAvailable: false,
      isLP: false,
      lpUrl: "",
      name: "real_estate",
      networkAddrs: {},
      reserveContract: [],
      bondDiscount: "Coming soon",
      type: 1,
      price: "-",
    },
    {
      bondContractABI: [],
      bondIconSvg: ArtImg,
      bondToken: "ART",
      displayName: "ART",
      displayUnits: "LP",
      isAvailable: false,
      isLP: false,
      lpUrl: "",
      name: "art",
      networkAddrs: {},
      reserveContract: [],
      bondDiscount: "Coming soon",
      type: 1,
      price: "-",
    },
  ];

  useEffect(() => {
    let bondDetails: IAllBondData[];
    bondDetails = allBonds
      .flatMap(bond => {
        if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
          return Object.assign(bond, bondState[bond.name]); // Keeps the object type
        }
        return bond;
      })
      .flatMap(bond => {
        if (accountBondsState[bond.name]) {
          return Object.assign(bond, accountBondsState[bond.name]);
        }
        return bond;
      });

    const mostProfitableBonds = bondDetails.concat().sort((a, b) => {
      if (a.getAvailability(chainID) === false) return 1;
      return a["bondDiscount"] > b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0;
    });

    setBonds(mostProfitableBonds);
    // @ts-ignore
    setRealBonds(realBondsMock);
  }, [bondState, accountBondsState, bondLoading]);

  // Debug Log:
  // console.log(bonds);
  // console.log(realBonds);
  return { bonds, realBonds, loading: bondLoading };
}

export default useBonds;
