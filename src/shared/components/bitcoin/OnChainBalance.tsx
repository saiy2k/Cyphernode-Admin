import { useState, useEffect } from "react";

import { Skeleton, chakra } from "@chakra-ui/react";

import { withErrorBoundary, useErrorHandler } from "react-error-boundary";

import { getCallProxy } from "@shared/services/api";
import { ValueBox } from "app/DashboardWidgets";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";

const TITLE = "Onchain balance";

function OnChainBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const handleError = useErrorHandler();

  useEffect(() => {
    (async () => {
      setBalanceLoading(true);

      try {
        const balanceP = await getCallProxy("getbalance");
        if (!balanceP.ok) {
          throw new Error(balanceP.status + ': ' + balanceP.statusText);
        }

        const resp = await balanceP.json();
        setBalance(resp.balance);
      } catch (err) {
        console.error(err);
        handleError(err);
      } finally {
        setBalanceLoading(false);
      }
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
        {balance}
        <chakra.span fontSize={{ base: "0.5em" }}> BTC </chakra.span>
      </Skeleton>
    </ValueBox>
  );
}

const OnChainBalanceWithErrorBoundary = withErrorBoundary(OnChainBalance, {
  fallbackRender: (fallbackProps) => (
    <ValueBox title={TITLE}>
      <ErrorBoundaryFallback {...fallbackProps} removeWidget={true} />
    </ValueBox>
  )
});

export default OnChainBalanceWithErrorBoundary;
