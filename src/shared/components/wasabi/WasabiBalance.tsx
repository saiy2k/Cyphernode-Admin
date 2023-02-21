import { useState, useEffect } from "react";

import { Flex, Icon, Skeleton, Text } from "@chakra-ui/react";

import { withErrorBoundary, useErrorHandler } from "react-error-boundary";
import { IoRefreshCircleOutline } from "react-icons/io5";

import { ValueBox } from "app/DashboardWidgets";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";
import { getCallProxy } from "@shared/services/api";
import { WasabiGetBalancesSuccessResponse, WasabiInstanceBalance } from "@shared/types";

type WasabiBalanceProps = {
  isLoading: boolean;
  balance: WasabiInstanceBalance;
  instance: string;
};

const tr = {
  border: 'none !important',
  lineHeight: 'auto',
};

const td = {
  padding: '5px 0',
  width: '50%',
}

function WasabiBalance({ isLoading, balance, instance }: WasabiBalanceProps) {
  return (
    <ValueBox title={`${instance} Balance`}>
      <table>
        <tr style={tr}>
          <td style={td}>
            <b>
              <Text>Received</Text>
            </b>
          </td>
          <td style={td}>
            <Skeleton
              borderRadius="10px"
              width="100%"
              height="30px"
              isLoaded={!isLoading}
              display='flex'
              alignItems='center'
            >
              <Text width='100%' textAlign='right'>{balance.rcvd0conf.toLocaleString('en-ca')}</Text>
            </Skeleton>
          </td>
        </tr>
        <tr style={tr}>
          <td style={td}>
            <b>
              <Text>Mixing</Text>
            </b>
          </td>
          <td style={td}>
            <Skeleton
              borderRadius="10px"
              width="100%"
              height="30px"
              isLoaded={!isLoading}
              display='flex'
              alignItems='center'
            >
              <Text width='100%' textAlign='right'>{balance.mixing.toLocaleString('en-ca')}</Text>
            </Skeleton>
          </td>
        </tr>
        <tr style={tr}>
          <td style={td}>
            <b>
              <Text>Private</Text>
            </b>
          </td>
          <td style={td}>
            <Skeleton
              borderRadius="10px"
              width="100%"
              height="30px"
              isLoaded={!isLoading}
              display='flex'
              alignItems='center'
            >
              <Text width='100%' textAlign='right'>{balance.private.toLocaleString('en-ca')}</Text>
            </Skeleton>
          </td>
        </tr>
        <tr style={tr}>
          <td style={td}>
            <b>
              <Text>Total</Text>
            </b>
          </td>
          <td style={td}>
            <Skeleton
              borderRadius="10px"
              width="100%"
              height="30px"
              isLoaded={!isLoading}
              display='flex'
              alignItems='center'
            >
              <Text width='100%' textAlign='right'>{balance.total.toLocaleString('en-ca')}</Text>
            </Skeleton>
          </td>
        </tr>
      </table>
    </ValueBox>
  );
}

const TITLE = "Wasabi balance";

const initialBalance = {
  all: {
    rcvd0conf: 0,
    mixing: 0,
    private: 0,
    total: 0,
  },
  0: {
    rcvd0conf: 0,
    mixing: 0,
    private: 0,
    total: 0,
  },
  1: {
    rcvd0conf: 0,
    mixing: 0,
    private: 0,
    total: 0,
  }
};

function WasabiBalances() {
  console.log("WasabiBalance :: Render");

  const [balance, setBalance] = useState<WasabiGetBalancesSuccessResponse>(initialBalance);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const handleError = useErrorHandler();

  useEffect(() => {
    fetchBalances();
  }, []);

  async function fetchBalances() {
    setBalanceLoading(true);

    try {
      const balanceP = await getCallProxy("wasabi_getbalances");
      if (!balanceP.ok) {
        throw new Error(balanceP.status + ': ' + balanceP.statusText);
      }

      const resp = await balanceP.json();
      setBalance(resp);
    } catch (err) {
      console.error(err);
      handleError(err);
    } finally {
      setBalanceLoading(false);
    }
  }

  return (
    <Flex
      gap={5}
      flexDirection={{
        base: 'column',
        sm: 'row'
      }}
      justifyContent={{md: 'center'}}
      position="relative"
    >
      <WasabiBalance
        isLoading={balanceLoading}
        instance="Instance 0"
        balance={balance[0]}
      />

      <WasabiBalance
        isLoading={balanceLoading}
        instance="Instance 1"
        balance={balance[1]}
      />

      <Icon
        width={{base: '50px'}}
        height={{base: '50px'}}
        cursor="pointer"
        as={IoRefreshCircleOutline}
        position='absolute'
        left={{base: '50%', md: 'none'}}
        top={{base: '50%'}}
        right='0'
        transform={{base: 'translate(-50%, -50%)'}}
        onClick={fetchBalances}
      />      
    </Flex>
  );
}

const WasabiBalanceWithErrorBoundary = withErrorBoundary(WasabiBalances, {
  fallbackRender: (fallbackProps) => (
    <ValueBox title={TITLE}>
      <ErrorBoundaryFallback {...fallbackProps} removeWidget={true} />
    </ValueBox>
  ),
});

export default WasabiBalanceWithErrorBoundary;
