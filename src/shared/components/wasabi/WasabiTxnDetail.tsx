import React, { PropsWithChildren } from 'react';

import {
  Box,
  Flex,
  Link,
  IconButton,
  Text,
  useToast,
  useClipboard,
  Button,
} from '@chakra-ui/react';

import { MdLink, MdContentCopy } from 'react-icons/md';
import { Row } from '@tanstack/react-table';

import { WasabiTxn } from '@shared/types';
import { textStyles } from '@theme/customStyles';
import DetailRow, { DetailRowData } from '../ClientDataTable/DetailRow';

type WasabiTxnDetailProps = PropsWithChildren & {
  row: Row<WasabiTxn>,
};

const textOverflowStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

export const WasabiTxnDetail = ({row}: WasabiTxnDetailProps) => {

  console.log("WasabiTxnDetail :: Render")

  const { onCopy: onCopyTxid } = useClipboard(row.original.tx);
  const toast = useToast();

  const showToast = () => {
    toast({
      title: 'Copied...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const detailRows: DetailRowData[] = [
    {
      _key: 'date',
      title: 'Date',
      value: row.original.datetime,
      textComponent: (props: any) => <Text {...props} {...textStyles.body}>{new Date(row.original.datetime).toLocaleDateString()}</Text>,
      type: 'text',
    },
    {
      _key: 'amount',
      title: 'Amount',
      value: row.original.amount,
      textComponent: (props: any) => <Text {...props} {...textStyles.body}>{Math.abs(row.original.amount)} SATS</Text>,
      type: 'number',
    },
    {
      _key: 'txid',
      title: 'Transaction ID',
      value: row.original.tx,
      textComponent: (props: any) => (
        <Flex alignItems='center'>
          <Text {...props} {...textOverflowStyle} {...textStyles.body}>{row.original.tx}</Text>
          <IconButton 
              aria-label='Copy address' 
              icon={<MdContentCopy />}  
              variant='outline'
              ml={2} w={6} h={6} 
              onClick={() => {
                onCopyTxid();
                showToast();
              }}
          />
          <Link target='_blank' href={`https://mempool.space/tx/${row.original.tx}`}>
            <IconButton 
              aria-label='Open transaction in mempool.space' 
              icon={<MdLink />}  
              variant='outline'
              ml={2} w={6} h={6}
            />
          </Link>
        </Flex>
      ),
      type: 'text',
      nonEditable: true,
    },
    {
      _key: 'label',
      title: 'Label',
      value: row.original.label,
      textComponent: (props: any) => (
        <Flex alignItems='center'>
          <Text {...props} {...textOverflowStyle} {...textStyles.body}>{row.original.label.join("\n")}</Text>
        </Flex>
      ),
      type: 'text',
    }
  ];

  return (
    <Box my={2} width={{base: '100%', md: '100%'}}>
      <Flex flexDirection='column' gap={{base: 'none', md: '20px'}}>
        {
          detailRows.map((row: DetailRowData) => <DetailRow key={row._key} {...row} onChange={(key, value) => console.log(key, value)} />)
        }
      </Flex>
    </Box>
  );
}