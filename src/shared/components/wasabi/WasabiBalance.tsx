import { useState, useEffect } from "react";

import { Skeleton } from "@chakra-ui/react";

import { withErrorBoundary, useErrorHandler } from "react-error-boundary";

import { ValueBox } from "app/DashboardWidgets";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";

const TITLE = "Wasabi balance";

function WasabiBalance() {

  console.log("WasabiBalance :: Render")

  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const handleError = useErrorHandler();

  useEffect(() => {
    (async () => {
      // setBalanceLoading(true);

      // try {
      //   const balanceP = await getCallProxy("getbalance");
      //   if (!balanceP.ok) {
      //     throw new Error(balanceP.status + ': ' + balanceP.statusText);
      //   }

      //   const resp = await balanceP.json();
      //   setBalance(resp.balance);
      // } catch (err) {
      //   console.error(err);
      //   handleError(err);
      // } finally {
      //   setBalanceLoading(false);
      // }

      setBalance(100000120);
    })();
  }, []);

  return (
    <ValueBox title={TITLE}>
      <Skeleton
        borderRadius="10px"
        width="100%"
        height="50px"
        isLoaded={!balanceLoading}
      >
        {/* TODO: Move conversion to a separate file. Something like a pipe */}
        {balance.toLocaleString('en-ca')}
        {/* <chakra.span fontSize={{ base: "0.5em" }}> BTC </chakra.span> */}
      </Skeleton>
    </ValueBox>
  );
}

const WasabiBalanceWithErrorBoundary = withErrorBoundary(WasabiBalance, {
  fallbackRender: (fallbackProps) => (
    <ValueBox title={TITLE}>
      <ErrorBoundaryFallback {...fallbackProps} removeWidget={true} />
    </ValueBox>
  )
});

export default WasabiBalanceWithErrorBoundary;
