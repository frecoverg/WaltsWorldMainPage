import { StableBond, LPBond, NetworkID, CustomBond } from "src/lib/Bond";
import { addresses } from "src/constants";
import { ReactComponent as BUSDImg } from "src/assets/tokens/BUSD.svg";
import { abi as PairContract } from "src/abi/PairContract.json";
import { abi as BUSDBondContract } from "src/abi/bonds/BUSDBondDepository.json";
import { abi as WALTBUSDLPBondContract } from "src/abi/bonds/WALTBUSDLPBondDepository.json";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const busd = new StableBond({
  name: "BUSD",
  displayName: "BUSD",
  bondToken: "BUSD",
  bondIconSvg: BUSDImg,
  bondContractABI: BUSDBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x0e0806ff4e5549aE0bbbc1fcdA35f11dDff854EF",  // BUSDBondDepository
      reserveAddress: addresses[NetworkID.Mainnet].BUSD_ADDRESS,  // BUSD
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x126A072B25bAFDdBD68fc14a1A80Dda7F8B059B4",  // BUSDBondDepository
      reserveAddress: addresses[NetworkID.Testnet].BUSD_ADDRESS,  // BUSD
    },
  },
});

export const walt_busd = new LPBond({
  name: "WALT-BUSD",
  displayName: "WALT-BUSD LP",
  bondToken: "WALT-BUSD",
  bondIconSvg: BUSDImg,
  bondContractABI: WALTBUSDLPBondContract,
  reserveContract: PairContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x556208EA41edeFC16f9F80e85125cB9d21BE57B8", // WALTBUSDLPBondDepository
      reserveAddress: "0xC983b24Ad8b63b7f366f02a975e06af4fd75d7AC", // Ape BUSD/WALT
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x65bC60dc09134a9C5ED252497A8325c39958b450", // WALTBUSDLPBondDepository
      reserveAddress: "0x50e8bdb651cab184b605b0c3b3672e04c0e6881c", // PancakePair BUSD/WALT
    },
  },
  lpUrl:
   `https://pancakeswap.finance/add/${addresses[NetworkID.Mainnet].BUSD_ADDRESS}/${addresses[NetworkID.Mainnet].WALT_ADDRESS}`,
});

/*
export const walt_bnb_lp = new LPBond({
  name: "WALT-BNB",
  displayName: "WALT-BNB LP",
  bondToken: "WALT-BNB",
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: PairContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x7ac0Ce960aa87CE85800aD4225831640F01B6449", // WALTBUSDLPBondDepository
      reserveAddress: "0x3991e0988A69E4C8Fde46C011Dafe55E26fdD18D", // PancakePair busd/PID
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377", // OlympusBondDepository
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2", // UniswapV2Pair ohm/dai
    },
  },
  lpUrl:
   `https://pancakeswap.finance/add/${addresses[NetworkID.Mainnet].DAI_ADDRESS}/${addresses[NetworkID.Mainnet].WALT_ADDRESS}`,
});



export const eth = new CustomBond({
  name: "bnb",
  displayName: "wBNB",
  bondToken: "wBNB",
  bondIconSvg: wETHImg,
  bondContractABI: EthBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x87214cf488157eBD0eA93AEd2eFA2bb4493D34B9",
      reserveAddress: "0x250632378e573c6be1ac2f97fcdf00515d0aa91b", // BETH address
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
      reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab", // WETH address
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    let ethPrice = await ethBondContract.assetPrice();
    ethPrice = ethPrice / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let ethAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    ethAmount = ethAmount / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const ohm_dai = new LPBond({
  name: "WALT-BUSD",
  displayName: "WALT-BUSD LP",
  bondToken: "WALT-BUSD",
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x7ac0Ce960aa87CE85800aD4225831640F01B6449", // WALTBUSDLPBondDepository
      reserveAddress: "0x3991e0988A69E4C8Fde46C011Dafe55E26fdD18D", // PancakePair busd/PID
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377", // OlympusBondDepository
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2", // UniswapV2Pair ohm/dai
    },
  },
  lpUrl:
   `https://pancakeswap.finance/add/${addresses[NetworkID.Mainnet].DAI_ADDRESS}/${addresses[NetworkID.Mainnet].WALT_ADDRESS}`,
});
*/

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
// export const allBonds = [dai, eth, ohm_dai, walt_busd];

//export const allBonds = [busd, walt_busd]
export const allBonds = [busd, walt_busd]
// export const allBonds:LPBond[]=[]
export const treasuryBalanceAll = async ( networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  return (await Promise.all(allBonds.map(async (item) => {
    console.error(await item.getTreasuryBalance(networkID,provider))
    console.error(item.name)
    return await item.getTreasuryBalance(networkID,provider)
  }))).reduce((total,num)=>total + num)
}

export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log({allBonds});
export default allBonds;
