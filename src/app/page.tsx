'use client';

import { useEffect, useState } from 'react';

import { 
  chakra,
  Box,
  Button,
  Link,
  SimpleGrid
} from '@chakra-ui/react'

import { PrimaryButton, Widget } from '@shared-components/index';
import { ValueBox, WalletBox } from './DashboardWidgets';

import { baseURL } from './constants';

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

export default function Home() {

  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);
  const [balance, setBalance] = useState<number>(0);

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
      /*
      const _blockInfo = await blockInfoResp.json();
      setBlockInfo(_blockInfo);
       */

    })();

  }, []);

  const wallets = [{
    name: 'Bitcoin core spender 1',
    balance: 1.20194827,
    unconfirmedUntrusted: 0.1,
    unconfirmedTrusted: 0.1,
    confirmed: 1.00194827
  }, {
    name: 'Bitcoin core spender 2',
    balance: 0.80194827,
    unconfirmedUntrusted: 0.1,
    unconfirmedTrusted: 0.1,
    confirmed: 0.06194827
  }, {
    name: 'Bitcoin core spender 3',
    balance: 1.60194827,
    unconfirmedUntrusted: 0.1,
    unconfirmedTrusted: 0.1,
    confirmed: 1.40194827
  }, {
    name: 'Bitcoin core spender 4',
    balance: 2.60194827,
    unconfirmedUntrusted: 0.4,
    unconfirmedTrusted: 0.5,
    confirmed: 1.50194827
  }];

  const getWasabiAddress = () => {
    console.log('Home :: getWasabiAddress');
  }

  return (
    <Widget>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 2, xxl: 6 }} spacing='16px' mb={5}>
        <Box>
          <chakra.h3 mb={4}>
            Cypernode Summary
          </chakra.h3>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 2, xxl: 2 }} spacing='16px'>
            <ValueBox title='Total bitcoin balance'>
              { balance === 0 ? 'Loading...' : <> {balance} <chakra.span fontSize={{base: '0.5em'}}> BTC </chakra.span> </> }
            </ValueBox>

            <ValueBox title='Last block height'>
              { blockInfo && blockInfo.blocks ? blockInfo.blocks : 'Loading...' }
            </ValueBox>
          </SimpleGrid>
        </Box>

        <Box>
          <chakra.h3 mb={4}>
            Actions
          </chakra.h3>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 2, xxl: 2 }} spacing='16px'>
            <Button variant='outline'> Get Wasabi address </Button>
            <Button variant='outline'> Get proxy address </Button>
            <Button variant='outline'> Get liquid address </Button>
            <Button variant='outline'> Spend to </Button>
          </SimpleGrid>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xxl: 6 }} spacing='16px'>

        { wallets.map((wallet: any) => (
          <WalletBox
            key={wallet.name}
            title={wallet.name}
            balance={wallet.balance}
            unconfirmedUntrusted={wallet.unconfirmedUntrusted}
            unconfirmedTrusted={wallet.unconfirmedTrusted}
            confirmed={wallet.confirmed}
          />
        )) }

      </SimpleGrid>

    </Widget>
  )
}
