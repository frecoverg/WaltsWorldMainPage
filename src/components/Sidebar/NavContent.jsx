import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import styled from 'styled-components';
import { ReactComponent as PoolTogetherIcon } from "../../assets/icons/33-together.svg";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography as Typograp, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import LogoImg from '../../assets/ohm/WWLOGO.png'
import Bondimg from '../../assets/ohm/bond@2x.png'
import Bondimg2 from '../../assets/ohm/bond2@2x.png'
import Dashboardimg from '../../assets/ohm/dashboard@2x.png'
import Dashboardimg2 from '../../assets/ohm/dashboard2@2x.png'
import Stakeimg from '../../assets/ohm/stake@2x.png'
import Stakeimg2 from '../../assets/ohm/stake2@2x.png'
import Togetherimg from '../../assets/ohm/33-1@2x.png'
import Togetherimg2 from '../../assets/ohm/33@2x.png'
import NFTimg from '../../assets/ohm/nft-1@2x.png'
import NFTimg2 from '../../assets/ohm/nft@2x.png'
import Dollarlogo1 from '../../assets/ohm/dollar-zwart.png'
import Dollarlogo2 from '../../assets/ohm/dollar-bleu.png'
import Poocoin1 from '../../assets/ohm/Poocoin1.png'
import Poocoin2 from '../../assets/ohm/Poocoin2.png'
import Pickaxe1 from '../../assets/ohm/pickaxeblack.png'
import Pickaxe2 from '../../assets/ohm/pickaxeblue.png'
import Space1 from '../../assets/ohm/Spaceblue.png'
import Space2 from '../../assets/ohm/Spaceblack.png'
import Farm1 from '../../assets/ohm/farmblue.png'
import Farm2 from '../../assets/ohm/farmblack.png'
import Calc1 from '../../assets/ohm/calculatorblue.png'
import Calc2 from '../../assets/ohm/calculatorblack.png'
import WWFarm1 from '../../assets/ohm/wwfarmerBlack.png'
import WWFarm2 from '../../assets/ohm/wwfarmerBlue.png'


function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds } = useBonds();
  const { chainID } = useWeb3Context();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
      return true;
    }
    if (currentPath.indexOf("nft") >= 0 && page === "nft") {
      return true;
    }
    if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    return false;
  }, []);

  const isActiveFc = useCallback((name) => {
    return checkPage(null, window.location, name)
  }, [window.location])
  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://home.waltsworld.online" target="_blank">
              <img src={LogoImg} alt="" style={{ width: "175px" }} />
            </Link>
          </Box>
          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
            <ANavLink href="https://www.pinksale.finance/#/launchpad/0xdB37728632A148fFFeFDd4B5a78A6986BF2a9452?chain=BSC" target="_blank" className="ido"
              className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="" className="ido">
                  IDO
                </Typography>
              </ANavLink>

              <ANavLink
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isActive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                bg2={Dashboardimg2}
              >
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={Dashboardimg} />
                  Dashboard
                </Typography>
              </ANavLink>

              <ANavLink
                component={NavLink}
                to="/claim"
                isActive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                bg2={Dashboardimg2}
              >
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={Dollarlogo2} />
                  Claim WALT
                </Typography>
              </ANavLink>

              {/* <ANavLink href="https://pancakeswap.finance/swap?outputCurrency=0x6E5997a44Ea15Dec9feD08d8131dB392D5f3A03A" target="_blank" className="fxCenter"
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
                bg2={Dollarlogo1}>
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={Dollarlogo2} />
                  Buy WALT
                </Typography>
              </ANavLink> */}

              <ANavLink
                component={NavLink}
                id="stake-nav"
                to="/stake"
                isActive={(match, location) => {
                  return checkPage(match, location, "stake");
                }}
                bg2={Stakeimg2}
              >
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={Stakeimg} />
                  Stake
                </Typography>
              </ANavLink>
              
              <ANavLink href="https://miner.waltsworld.online?ref=0xdaa640D7cAAa8355e66A1A776b0a3C2EB0158f90" target="_blank" className="fxCenter"
              className={`button-dapp-menu ${isActive ? "active" : ""}`}
                bg2={Pickaxe1}
              >
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={Pickaxe2} />
                  WaltsMiner
                </Typography>
              </ANavLink>

              <ANavLink href="https://farmer.waltsworld.online/" target="_blank" className="fxCenter"
              className={`button-dapp-menu ${isActive ? "active" : ""}`}
                bg2={WWFarm1}
              >
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={WWFarm2} />
                  WaltsFarmer
                </Typography>
              </ANavLink>

              <ANavLink href="https://nodes.waltsworld.online/" target="_blank" className="fxCenter"
              className={`button-dapp-menu ${isActive ? "active" : ""}`}
                 bg2={Space2}
              >
                 <Typography variant="h6" className="fxCenter">
                    <ANavIcon bg1={Space1} />
                    WaltsNode
                  </Typography>
                </ANavLink>
{/*              
              <ANavLink
                component={NavLink}
                id="33-together-nav"
                to="/33-together"
                isActive={(match, location) => {
                  return checkPage(match, location, "33-together");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
                bg2={Togetherimg2}
              >
                <Typography variant="h6">
                  <ANavIcon bg1={Togetherimg} />
                  3,3 Staking
                </Typography>
              </ANavLink>  */}

              <ANavLink
        //        component={NavLink}
        //        id="nft"
        //        to="/nft"
        //        isActive={(match, location) => {
        //          return checkPage(match, location, "nft");
        //        }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
                bg2={NFTimg2}
              >
                <Typography variant="h6">
                  <ANavIcon bg1={NFTimg} />
                  WALT NFT ( Coming soon )
                </Typography>
              </ANavLink>

              <ANavLink href="" target="_blank" className="fxCenter"
                      className={`button-dapp-menu ${isActive ? "active" : ""}`}
                       bg2={Farm2}>
                        <Typography variant="h6" className="fxCenter">
                         <ANavIcon bg1={Farm1} />
                         WW Farm ( Coming soon )
                       </Typography>
                  </ANavLink>
                  
              <ANavLink
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                bg2={Bondimg2}
              >
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={Bondimg} />
                  Bond
                </Typography>
              </ANavLink>

              <div className="dapp-menu-data discounts">
                <div className="bond-discounts">
                  <Typography variant="body2">Bond discounts</Typography>
                  {bonds.map((bond, i) => (
                    <ANavLink component={NavLink} to={`/bonds/${bond.name}`} key={i} className={"bond"}>
                      {!bond.bondDiscount ? (
                        <Typography variant="body2">
                        {bond.displayName}
                        <span className="bond-pair-roi">
                          0%
                        </span>
                      </Typography>
                      ) : (
                        <Typography variant="body2">
                          {bond.displayName}
                          <span className="bond-pair-roi">
                            {bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%
                          </span>
                        </Typography>
                      )}
                    </ANavLink>
                  ))}

                  <ANavLink href="https://poocoin.app/tokens/0x6E5997a44Ea15Dec9feD08d8131dB392D5f3A03A" target="_blank" className="fxCenter"
                      className={`button-dapp-menu ${isActive ? "active" : ""}`}
                       bg2={Poocoin1}>
                        <Typography variant="h6" className="fxCenter">
                         <ANavIcon bg1={Poocoin2} />
                         PooCoin
                       </Typography>
                  </ANavLink>

                  <ANavLink
                component={NavLink}
                id="calculator-nav"
                to="/calculator"
                isActive={(match, location) => {
                  return checkPage(match, location, "calculator");
                }}
                bg2={Calc2}
              >
                <Typography variant="h6" className="fxCenter">
                  <ANavIcon bg1={Calc1} />
                  Calculator
                </Typography>
              </ANavLink>
              
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <ANavLink key={i} href={`${externalUrls[link].url}`} target="_blank">
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                </ANavLink>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;

const ANavIcon = styled.div`
  width:20px;
  height: 20px;
  background-image: url(${props => props.bg1});
  background-size: 100%;
  margin-right:12px;
`

const ANavLink = styled(Link)`
  &:hover,&.active{
    text-decoration:none;
    h6{
    color:#000000;
    }
    ${ANavIcon}{
      background-image: url(${props => props.bg2});
    }
  }
`

const Typography = styled(Typograp)`
  display: flex;
  align-items: center;
`
