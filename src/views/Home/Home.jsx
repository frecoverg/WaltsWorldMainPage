import { useDispatch,useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom,Button } from "@material-ui/core";
import { formatCurrency, getDisplayBalance, trim } from "../../helpers";
import {useEffect,useCallback, useMemo} from 'react'
import { useWeb3Context } from "src/hooks/web3Context";
import "./home.scss";
import { Skeleton } from "@material-ui/lab";
import Logoimg from '../../assets/ohm/WWLOGO.png'
import { Link } from "react-router-dom";
import TimeCountdown from "src/components/TimeCountdown";
import img1_1 from '../../assets/ohm/1-1.png';
import img1_2 from '../../assets/ohm/1-2.png';
import img1_3 from '../../assets/ohm/1-3.png';
import img1_4 from '../../assets/ohm/1-4.png';
import CaiDan from '../../assets/ohm/tuozhuaicaidandaohang.png'
import { useState } from "react";
import { SvgIcon } from "@material-ui/core";
import medium from '../../assets/ohm/med@2x.png';
import discord from '../../assets/ohm/discord-logo.png';
import { FixedFormat } from "@ethersproject/bignumber";
import styled from "styled-components";
import GuanImg from '../../assets/ohm/copy-2-3@3x.png'
import { shorten } from "../../helpers";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { changeApproval, changeStake } from "../../slices/IdoThunk";

function Home() {
  const { provider, address, connected, connect, chainID,disconnect } = useWeb3Context();
  const [menu, setmenu] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isConnected, setConnected] = useState(connected);
  const [anchorEl, setAnchorEl] = useState(null);
  const [delayShow,setDelayShow] = useState(false)

  const stakedTotal= useSelector(state => {
    // console.error(state.app?.circVal)
    
    return state?.app?.circVal ? getDisplayBalance(state?.app?.circVal,9):null;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  
  const treasuryMarketValue = useSelector(state => {
    return state.app.treasuryMarketValue;
  });
  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  const onComplete = useCallback(()=>{
    setDelayShow(true) 
  },[])
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = shorten(address);
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "ohm-popper-pending" : undefined;

  const primaryColor =  "#ffe300";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? " hovered-button" : "");

  const idoBalance = useSelector(state => {
    if(state.account.ido){
      return state.account.ido.idoBalance
    }
    return null
  });
  const busdAmount = useSelector(state => {
    if(state.account.ido){
      return state.account.ido.busdAmount
    }
    return null
  });
  
  const isPay = useSelector(state => {
    if(state.account.ido){
      return state.account.ido.isPay
    }
    return null
  });
  
  const openStartTimes=useMemo(()=>{
    return 1636113600000
    // return Date.now() + 5000
  },[])

  const isOpen = useMemo(() => {
    return Date.now() > openStartTimes
  },[delayShow,openStartTimes]);
  const stakingAPY = useSelector(state=>{
    return state.app.stakingAPY
  })
  
  const openIsPayTime = useMemo(()=>{
    return Date.now() < (1636113600000 + 86400000) 
  },[])
  const openOverTimes=useMemo(()=>{
    return 1636372800000 
  },[isOpen])
  const isOver = useMemo(()=>{
    return Date.now() > openOverTimes
  },[Date.now(),openOverTimes])
  
  useEffect(() => {
    if (address) {
      connect();
    }
  }, [address]);
  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [connected]);

  const ShowhideClick = () => {
    setmenu(!menu);
  }

  const [Popup, setPopup] = useState(false);
  const PopupClick = () => {
    let timeId = null;
    if(isPay === true){
      setPopup(false)
      return
    }
    if(isConnected){
      setPopup(!Popup)
    }else{
      clickFunc()
    }
  }

  return <div className="home_gd">

    <div className="headBox">
      <div className="CaiDanImgBox">
        <img src={CaiDan} alt="" onClick={() => ShowhideClick()} className="caidanimg" />
      </div>
    </div>
    <div className="ul2">
    </div>
    <div className="boodyBox fxColumn">
      <div className="titleColor">
        We have moved our mainpage!
      </div>
      <div className="titleColor">
        <a href="https://home.waltsworld.online">https://home.waltsworld.online</a>
      </div>
      <div style={{ height: 30 }}></div>
       <div className="DaoJishi">
        {isOpen ? <>
        </>:<>
          <span>ITO Application Ends In</span><TimeCountdown onComplete={onComplete} base={new Date} deadline={new Date(openStartTimes)} />
        </>} 
      </div>
       <div style={{ display: "flex", justifyContent: "center", }}>
        <div style={{ width: 20 }} />      
      </div> 
      <div className="fxBetween">
        <a href="../stake" className="btnBox_1">Enter App</a>
        <a href="https://waltsworlddao.gitbook.io/waltsworld/" className="btnBox_2 a" target="_blank">Documentation</a>
      </div>
  {/*    <div className="fxBetween2 mgTop">
        <div className="fxColumn2">
          <div className="minTatleColor">Total Staked</div>
          <div style={{minWidth:80,textAlign:'center'}} className="valueColor">
            {stakedTotal ? trim(stakedTotal, 2): <Skeleton type="text" />}
            </div>
        </div>
        <div className="fxColumn2 mgLf">
          <div className="minTatleColor">Treasury Balance</div>
          <div style={{minWidth:80,textAlign:'center'}}  className="valueColor">
            {treasuryMarketValue ? formatCurrency(treasuryMarketValue, 2) : <Skeleton type="text" />}
          </div>
        </div>
        <div className="fxColumn2 mgLf">
          <div className="minTatleColor">Current APY</div>
          <div style={{minWidth:80,textAlign:'center'}}  className="valueColor">
          {stakingAPY ? `${trim(stakingAPY*100, 2)}%` : <Skeleton type="text" />}
         </div> 
        </div> 
      </div>*/}
    </div>

  {/*  <div className="bottomBor a">
      <a href="https://twitter.com/WaltsWorldDAO" target="_blank" className="bottomImgs a2"><img src={img1_1} alt="" className="bottomImgs2" /></a>
      <a href="" target="_blank" className="bottomImgs a2"><img src={img1_2} alt="" className="bottomImgs2" /></a>  
      <a href="https://discord.gg/FRYp6vxnnd" target="_blank" className="bottomImgs a2"><img src={discord} alt="" className="bottomImgs2" /></a>
      <a href="https://t.me/MoonFarmersChat" target="_blank" className="bottomImgs a"><img src={img1_4} alt="" className="bottomImgs2" /></a>
       <a href="" target="_blank" className="bottomImgs a"><img src={DiscordImg} alt="" className="bottomImgs2" /></a> 
    </div> */}
    {menu ?
      <div className="moban" onClick={() => ShowhideClick()} >
        <div className="CaiDanlieBiao">
          <img src={Logoimg} alt="" className="logo2" />
          <div className="lis2"><a target="_blank" className="a" href="https://waltsworlddao.gitbook.io/waltsworld/whitepapers/waltsworld-pro">WaltsWorld Pro</a></div>
          <div className="lis2"><a className="a" href="/stake">Stake</a></div>
          <div className="lis2"><a className="a" href="/bonds">Bond</a></div>
          <div className="lis2"><a target="_blank" className="a" href="https://waltsworlddao.gitbook.io/waltsworld/waltsworld/faqs">FAQs</a></div>
          <div className="lis2"><a target="_blank" className="a" href="https://waltsworlddao.gitbook.io/waltsworld/community/governance">Get Involved</a></div>
          {/* <a href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-OlympusDAO-v1.0.pdf" target="_blank" ><img src={ShenJiImg1} alt="" className="shenji2" /></a>
          <a href="https://omniscia.io/olympusdao-algorithmic-currency-protocol/" target="_blank"><img src={ShenJiImg2} alt="" className="shenji3" /></a> */}
        </div>
      </div> : null}

    {Popup ?
      <div className="Max_Box">
        <div className="Min_Box">
        <div onClick={() => PopupClick()} className="close"><img src={GuanImg} alt="" width="14px"/></div>
        <PAYSTATUS isPay={isPay} openIsPayTime={openIsPayTime} isOpen={isOpen} busdAmount={busdAmount} idoBalance={idoBalance}/>
        </div>
      </div>
      : null}

  </div>
}

export default Home;
const PAYSTATUS=({idoBalance,isPay,isOpen,busdAmount,openIsPayTime})=>{
  console.error({
    sss:isPay === true,
    isPay
  })
  if(openIsPayTime === true){
    return <PadingBaiMingDan_Box title={'ITO whitelist updating, please stay tuned with notice in the telegram group'}/>
  }
  if(idoBalance === null || isOpen === null){
    return <Pading_Box/>
  }else if(isOpen === false){
    return <PadingBaiMingDan_Box title={''}/>
  }else if(isPay === true){
    
    return <PadingBaiMingDan_Box title={'Purchased'}/>
  }else if(idoBalance >0){
    return <Inp_Box busdAmount={busdAmount} idoBalance={idoBalance}/>
  }else {
    return <PadingBaiMingDan_Box/>
  }
}

function Inp_Box({idoBalance,busdAmount}) {
  const { provider, address, connected, connect, chainID,disconnect } = useWeb3Context();
  const dispatch = useDispatch();

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  
  const stakeAllowance = useSelector(state => {
    return state.account.ido && state.account.ido.idoAllowance;
  });
  const hasAllowance = useCallback(
    () => {
      console.error(stakeAllowance > 0)
      return stakeAllowance > 0;
    },
    [stakeAllowance],
  )
  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  }
  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    await dispatch(changeStake({ address, action, provider, networkID: chainID }));
  };
  const onClick=()=>{

  }
  return <MinInp_Box>
    <div className="Content_Box1">
      <span>Your ITO Quota</span>
    </div>
    <div className="Content_Box2">
      <div>ITO Quota</div>
      <input type="text" placeholder={`${idoBalance}WALT`} className="InpStyle" />
    </div>
    <div className="Content_Box2">
      <div>Purchase</div>
      <input type="text" placeholder={`${busdAmount}BUSD`} disabled className="InpStyle" />
    </div>
    <div className="Content_Box3">
    WaltsWorld project will launch on ???, you will be able to claim your WALT token manually on the website. 
    </div>

    {address && hasAllowance() ? (
      <div onClick={onClick} 
      disabled={isPendingTxn(pendingTransactions, "staking")}
        onClick={() => {
          onChangeStake("stake");
        }}
      className="Content_Box4">
        {txnButtonText(pendingTransactions, "buy", "Purchase")}
    </div>
    ) : (
      <Button
        className="stake-button"
        variant="contained"
        color="primary"
        disabled={isPendingTxn(pendingTransactions, "approve_staking")}
        onClick={() => {
          onSeekApproval();
        }}
      >
        {txnButtonText(pendingTransactions, "approve", "Approve")}
      </Button>
    )}
    
  </MinInp_Box>
}

const MinInp_Box = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`
function Pading_Box (){
  return<PadingBox>
    <PandingImg src={PdImg}/>
    <PandingContent>Evaluating, please wait a moment～</PandingContent>
  </PadingBox>
}

function PadingBaiMingDan_Box ({title="You are not on the whitelist"}){
  return<PadingBox>
    <PandingImg src={WuImg}/>
    <PandingContent>{title}</PandingContent>
  </PadingBox>
}
const PadingBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const PandingImg = styled.img`
  /* width: 100%; */
  max-width: 332px;
`
const PandingContent = styled.div`
  color: #afb0b3;
  margin-top: 43px;
`
