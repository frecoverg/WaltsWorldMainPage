import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import IDOAbi from '../abi/ido.json'

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { Bond, NetworkID } from "src/lib/Bond"; // TODO: this type definition needs to move out of BOND.
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const ohmContract = new ethers.Contract(addresses[networkID].WALT_ADDRESS as string, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SWALT_ADDRESS as string, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    
    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei")
      },
    };
  },
);

interface IUserAccountDetails {
  balances: {
    dai: string;
    ohm: string;
    sohm: string;
  };
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  bonding: {
    daiAllowance: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmBalance = 0;
    let sohmBalance = 0;
    let fsohmBalance = 0;
    let wsohmBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let pwaltClaimAllowance = 0;
    let busdClaimAllowance = 0;
    let aOHMAbleToClaim = 0;
    let poolBalance = 0;
    let poolAllowance = 0;

    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2,
      provider,
    );

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider);
    const daiBalance = await daiContract.balanceOf(address);

    const pwaltContract = new ethers.Contract(addresses[networkID].PWALT_ADDRESS as string, ierc20Abi, provider);
    const pwaltBalance = await pwaltContract.balanceOf(address);

    const busdContract = new ethers.Contract(addresses[networkID].BUSD_ADDRESS as string, ierc20Abi, provider);
    const busdBalance = await busdContract.balanceOf(address);

    if (addresses[networkID].WALT_ADDRESS) {
      const ohmContract = new ethers.Contract(addresses[networkID].WALT_ADDRESS as string, ierc20Abi, provider);
      ohmBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }
    
    if (addresses[networkID].SWALT_ADDRESS) {
      const sohmContract = new ethers.Contract(addresses[networkID].SWALT_ADDRESS as string, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      // poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
    }

    if (addresses[networkID].PWALT_ADDRESS) {
      pwaltClaimAllowance = await pwaltContract.allowance(address, addresses[networkID].CLAIM_ADDRESS);
    }

    if (addresses[networkID].BUSD_ADDRESS) {
      busdClaimAllowance = await busdContract.allowance(address, addresses[networkID].CLAIM_ADDRESS);
    }
   
    if (addresses[networkID].PT_TOKEN_ADDRESS) {
      const poolTokenContract = await new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS, ierc20Abi, provider);
      poolBalance = await poolTokenContract.balanceOf(address);
    }

    for (const fuseAddressKey of ["FUSE_6_SOHM", "FUSE_18_SOHM"]) {
      if (addresses[networkID][fuseAddressKey]) {
        const fsohmContract = await new ethers.Contract(
          addresses[networkID][fuseAddressKey] as string,
          fuseProxy,
          provider,
        );
        fsohmContract.signer;
        const exchangeRate = ethers.utils.formatEther(await fsohmContract.exchangeRateStored());
        const balance = ethers.utils.formatUnits(await fsohmContract.balanceOf(address), "gwei");
        fsohmBalance += Number(balance) * Number(exchangeRate);
      }
    }
   
    if (addresses[networkID].WSWALT_ADDRESS) {
      const wsohmContract = new ethers.Contract(addresses[networkID].WSWALT_ADDRESS as string, wsOHM, provider);
      const balance = await wsohmContract.balanceOf(address);
      wsohmBalance = await wsohmContract.wOHMTosOHM(balance);
    }
    let idoBalance=null
    let busdAmount = null
    let idoAllowance = null
    let IsPay = false
    let IsOpen=false
    if(addresses[networkID].IDO_ADDRESS){
      try{
        const iodContract = new ethers.Contract(addresses[networkID].IDO_ADDRESS as string, IDOAbi, provider);
        idoBalance = (await iodContract.Whitelist(address)).toNumber() / 1e9 
        busdAmount = ethers.utils.formatUnits(await iodContract.getBusdAmount(address))
        const busdContract = new ethers.Contract(addresses[networkID].BUSD_ADDRESS as string, ierc20Abi, provider);
        idoAllowance = await busdContract.allowance(address, iodContract.address);
        IsPay = await iodContract.IsPay(address)
        IsOpen= await iodContract.IsOpen()
        
      }catch(e){
        console.error(e)
        idoAllowance=0
        idoBalance=0 
      }
    }

    const [depositAmount, gons, expiry, ] = await stakingContract.warmupInfo(address);

    return {
      ido:{
        isOpen:IsOpen,
        isPay:IsPay,
        idoAllowance,
        idoBalance,
        busdAmount
      },
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        pohm: ethers.utils.formatUnits(pwaltBalance, "ether"),
        fsohm: fsohmBalance,
        wsohm: ethers.utils.formatUnits(wsohmBalance, "gwei"),
        busd: ethers.utils.formatUnits(busdBalance, "ether"),
      },
      warmup: {
        balance: ethers.utils.formatUnits(depositAmount, "gwei"),
        gons: ethers.utils.formatUnits(gons, "gwei"),
        expiry: expiry * 1,
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      claim: {
        pwaltClaimAllowance: pwaltClaimAllowance,
        busdClaimAllowance: busdClaimAllowance,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
      pooling: {
        sohmPool: +poolAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
    balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ohm: string;
    sohm: string;
    dai: string;
    oldsohm: string;
  };
  warmup: {
    balance: string;
    gons: string;
    expiry: number;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "" },
  warmup: {balance: "", gons: "", expiry: 0},
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);