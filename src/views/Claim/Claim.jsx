import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeClaim } from "../../slices/ClaimThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  useMediaQuery,
  Container,
  Box,
  Zoom,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { trim } from "../../helpers";
import "./claim.scss";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

function Claim() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const pwaltBalance = useSelector(state => {
    return state.account.balances && state.account.balances.pohm;
  });
  const busdBalance = useSelector(state => {
    return state.account.balances && state.account.balances.busd;
  });
  const setMax = () => {
    setQuantity(pwaltBalance);
  };
  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };
  const pwaltClaimAllowance = useSelector(state => {
    return state.account.claim && state.account.claim.pwaltClaimAllowance;
  });
  const busdClaimAllowance = useSelector(state => {
    return state.account.claim && state.account.claim.busdClaimAllowance;
  });

  const onChangeClaim = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let etherValue = ethers.utils.parseUnits(quantity, "ether");

    if (action === "claim" && etherValue.gt(ethers.utils.parseUnits(pwaltBalance, "ether"))) {
      return dispatch(error("You cannot claim more than your pWALT balance."));
    }

    if (action === "claim" && etherValue.gt(ethers.utils.parseUnits(busdBalance, "ether"))) {
      return dispatch(error("You should have enough BUSD balance in your wallet."));
    }

    await dispatch(changeClaim({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  console.log(pwaltClaimAllowance*1);
  console.log(busdClaimAllowance*1);
  const hasAllowance = useCallback(
    token => {
      if (token === "pwalt") return pwaltClaimAllowance > 0;
      if (token === "busd") return busdClaimAllowance > 0;
      return false;
    },
    [pwaltClaimAllowance, busdClaimAllowance],
  );
  const isAllowanceDataLoading = pwaltClaimAllowance == null && busdClaimAllowance == null;
  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "5rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "5rem",
        }}
      >
        <Box className={`hero-metrics`}>
          <Paper className={`ohm-card`}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              {address && !isAllowanceDataLoading ? (
                !hasAllowance("pwalt") || !hasAllowance("busd") ? (
                  <Box className="help-text">
                    <Typography variant="body1" className="stake-note" color="textSecondary">
                      <>
                        Please approve WaltsWorld to use your <b>pWALT</b> and <b>BUSD</b> for claim <b>WALT</b>.
                      </>
                    </Typography>
                  </Box>
                ) : (
                  <FormControl className="ohm-input" variant="outlined" color="primary">
                    <InputLabel htmlFor="amount-input"></InputLabel>
                    <OutlinedInput
                      id="amount-input"
                      type="number"
                      placeholder="Enter an amount"
                      className="stake-input"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      labelWidth={0}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button variant="text" onClick={setMax} color="inherit">
                            Max
                          </Button>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                )
              ) : (
                <Box width={"100%"} display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                  <div></div>
                  <Skeleton width="150px" />
                  <div></div>
                </Box>
              )}

              <TabPanel className="stake-tab-panel">
                {isAllowanceDataLoading ? (
                  <></>
                ) : (
                  address && hasAllowance("pwalt") && hasAllowance("busd") ? (
                    <Button
                      className="stake-button"
                      variant="contained"
                      color="primary"
                      disabled={isPendingTxn(pendingTransactions, "claim")}
                      onClick={() => {
                        onChangeClaim("claim");
                      }}
                    >
                      {txnButtonText(pendingTransactions, "claim", "Claim WALT")}
                    </Button>
                    ) : (
                      <>
                      {!hasAllowance("pwalt") ? (
                        <Button
                          className="approve-button"
                          variant="contained"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "approve_pwalt")}
                          onClick={() => {
                            onSeekApproval("pwalt");
                          }}
                        >
                          {txnButtonText(pendingTransactions, "approve_pWALT", "Approve pWALT")}
                        </Button>
                      ) : (
                        <></>
                      )}
                      {!hasAllowance("busd") ? (
                        <Button
                          className="approve-button"
                          variant="contained"
                          color="primary"
                          disabled={isPendingTxn(pendingTransactions, "approve_busd")}
                          onClick={() => {
                            onSeekApproval("busd");
                          }}
                        >
                          {txnButtonText(pendingTransactions, "approve_busd", "Approve BUSD")}
                        </Button>
                      ) : (
                        <></>
                      )}
                      </>
                    ))}
              </TabPanel>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Claim;
