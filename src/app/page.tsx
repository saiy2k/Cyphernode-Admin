'use client';

import { useEffect, useState } from 'react';

import { 
  chakra,
  Box,
  Button,
  Link,
  SimpleGrid
} from '@chakra-ui/react'

import { PrimaryButton, Widget } from '@shared/components/index';
import { ValueBox, WalletBox } from './DashboardWidgets';

import { BlockInfo } from '@shared/types';
import { getCallProxy } from '@shared/services/api';


export default function Home() {

  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    console.log('Home :: useEffect');

    (async() => {
      console.log('Home :: useEffect :: call API');
      const blockInfoP = await getCallProxy('getblockchaininfo');
      const balanceP = await getCallProxy('getbalance');

      const serverResp = await Promise.all([blockInfoP, balanceP]);

      console.log(serverResp);
      const resp = await Promise.all([serverResp[0].json(), serverResp[1].json()]);

      console.log(resp);

      setBlockInfo(resp[0]);
      setBalance(resp[1].balance);

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
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 2, xxl: 3 }} spacing='16px' mb={5}>
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
