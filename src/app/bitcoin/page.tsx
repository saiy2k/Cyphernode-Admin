'use client';

import { useEffect, useState } from 'react';

import { 
  chakra,
  Box,
  Button,
  Link,
  SimpleGrid,
  Flex,
  Spacer
} from '@chakra-ui/react'

import { 
  BitcoinReceiveWidget,
  BitcoinSendWidget,
  BitcoinTxnTable,
  ButtonGroup,
  Widget
} from '@shared/components/index';

import { ValueBox, WalletBox } from '../DashboardWidgets';

import { baseURL } from '@shared/constants';
import { getCall } from '@shared/services/api';
import { BlockInfo, Txn } from '@shared/types';


export default function Bitcoin() {

  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [txData, setTxData] = useState<Txn[]>([]);
  const [showSend, setShowSend] = useState<boolean>(false);
  const [showReceive, setShowReceive] = useState<boolean>(false);

  useEffect(() => {
    console.log('Home :: useEffect');

    (async() => {
      console.log('Home :: useEffect :: call API');
      const blockInfoP = await getCall('getblockchaininfo', 1);
      const balanceP = await getCall('getbalance', 2);

      const serverResp = await Promise.all([blockInfoP, balanceP]);
      const resp = await Promise.all([serverResp[0].json(), serverResp[1].json()]);

      setBlockInfo(resp[0]);
      setBalance(resp[1].balance);

    })();

  }, []);

  useEffect(() => {

    (async() => {
      const getBalanceP = await getCall('get_txns_spending', 2);
      const resp = await getBalanceP.json();
      setTxData(resp.txns);
      console.log(resp);
    })();

  }, []);

  return (
    <Widget>
      <Flex justifyContent='space-between' flexDirection={{base: 'column', sm: 'row'}} gap={{base: 10}} >

        <ValueBox title='Onchain balance'>
          { balance === 0 ? 'Loading...' : <> {balance} <chakra.span fontSize={{base: '0.5em'}}> BTC </chakra.span> </> }
        </ValueBox>

        <Flex gap={30}>
          <Button width={{base: 100, sm: 200}} h={12} onClick={() => setShowSend(!showSend) }> Send </Button>
          <Button width={{base: 100, sm: 200}} h={12} onClick={() => setShowReceive(!showReceive) }> Receive </Button>
        </Flex>

      </Flex>

      <Box display='flex' flexDirection='column' gap='30px' marginTop={'30px'} marginX='auto' maxWidth={{base: '100%', xl: '80%', xxl: '45%'}}>
        {showSend ? <BitcoinSendWidget /> : null }
        {showReceive ? <BitcoinReceiveWidget /> : null }
      </Box>

      <h2 style={{marginTop: 30, marginBottom: 15}}> Transactions </h2>
      <BitcoinTxnTable data={txData} />

    </Widget>
  )
}

