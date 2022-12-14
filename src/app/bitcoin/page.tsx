'use client';

import { useEffect, useState } from 'react';

import { 
  chakra,
  Box,
  Button,
  Link,
  SimpleGrid
} from '@chakra-ui/react'

import { 
  BitcoinReceiveWidget,
  BitcoinSendWidget,
  Widget
} from '@shared/components/index';

import { ValueBox, WalletBox } from '../DashboardWidgets';

import { baseURL } from '@shared/constants';

interface BlockInfo {
        chain: string;
        blocks: number;
        headers: number;
        bestblockhash: string;
        difficulty: number;
        time: number;
        mediantime: number;
        verificationprogress: number;
        initialblockdownload: boolean;
        chainwork: string;
        size_on_disk: number;
        pruned: boolean;
        warnings: string;
}

export default function Bitcoin() {

  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [showSend, setShowSend] = useState<boolean>(false);
  const [showReceive, setShowReceive] = useState<boolean>(false);

  useEffect(() => {
    console.log('Home :: useEffect');

    (async() => {
      console.log('Home :: useEffect :: call API');
      const blockInfoP = await fetch(`${baseURL}/getblockchaininfo`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMSIsImV4cCI6MTcwMjQ0ODczM30.M-qlE7C00qaQuTqsUXViKZP-u6ypW2uLEJHOapvHPgg'
        }
      });

      const balanceP = await fetch(`${baseURL}/getbalance`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMiIsImV4cCI6MTcwMjQ0ODcxNH0.0MG3P1KF5WLao-MRG2h8Ca3gzZFxmD-rk5KjxRudN8Y'
        }
      });

      const serverResp = await Promise.all([blockInfoP, balanceP]);
      const resp = await Promise.all([serverResp[0].json(), serverResp[1].json()]);

      setBlockInfo(resp[0]);
      setBalance(resp[1].balance);

      console.log(resp);

    })();

  }, []);

  return (
    <Widget>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 4, xxl: 6 }} spacing='16px' mb={5}>

        <ValueBox title='Onchain balance'>
          { balance === 0 ? 'Loading...' : <> {balance} <chakra.span fontSize={{base: '0.5em'}}> BTC </chakra.span> </> }
        </ValueBox>

        <Box></Box>

        <Button h={12} onClick={() => setShowSend(!showSend) }> Send </Button>
        <Button h={12} onClick={() => setShowReceive(!showReceive) }> Receive </Button>

      </SimpleGrid>

      {showSend ? <BitcoinSendWidget /> : null }
      {showReceive ? <BitcoinReceiveWidget /> : null }

    </Widget>
  )
}

