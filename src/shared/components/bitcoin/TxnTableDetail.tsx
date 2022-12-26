import React from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Flex,
  Link,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/react'
import { MdContentCopy } from 'react-icons/md';
import { MdLink } from 'react-icons/md';
import { DetailRow } from '@shared/types';
import {textStyles} from '@theme/customStyles';

export const TxnDetail = ({row}: {row: any}) => {

  const { onCopy: onCopyAddress } = useClipboard(row.original.address);
  const { onCopy: onCopyTxid } = useClipboard(row.original.txid);
  const toast = useToast();

  const showToast = () => {
    toast({
      title: 'Copied...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const detailRows: DetailRow[] = [
    {
      key: 1,
      left: {
        title: 'Amount',
        value: <Text {...textStyles.body}>{row.original.amount}</Text>
      },
      right: {
        title: 'Confirmations',
        value: <Text {...textStyles.body}>{row.original.confirmations}</Text>
      }
    },
    {
      key: 2,
      left: {
        title: 'Confirmed block',
        value: <Text {...textStyles.body}>{row.original.confirmations}</Text>
      },
      right: {
        title: '',
        value: ''
      }
    },
    {
      key: 3,
      left: {
        title: 'First seen time',
        value: <Text {...textStyles.body}>{dayjs(row.original.time * 1000).format("DD-MMM-YYYY hh:mm:ss A")}</Text>
      },
      right: {
        title: 'Date',
        value: <Text {...textStyles.body}>{dayjs(row.original.timereceived * 1000).format("DD-MMM-YYYY hh:mm:ss A")}</Text>
      }
    },
    {
      key: 4,
      left: {
        title: 'Transaction ID',
        value: (
          <Flex alignItems='center'>
            <Text whiteSpace={{base: 'nowrap', md: 'normal'}} overflow={{base: 'hidden', md: 'unset'}} width={{base: '150px', md: 'auto'}} textOverflow='ellipsis' {...textStyles.body} maxW='400px'>
              { row.original.txid }
            </Text>
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
          </Flex>
        )
      },
      right: {
        title: 'Address',
        value: (
          <Flex alignItems='center'>
            <Text whiteSpace={{base: 'nowrap', md: 'normal'}} overflow={{base: 'hidden', md: 'unset'}} width={{base: '150px', md: 'auto'}} textOverflow='ellipsis' {...textStyles.body} maxW='400px'>
              { row.original.address }
            </Text>
            <IconButton 
                aria-label='Copy address' 
                icon={<MdContentCopy />}  
                variant='outline'
                ml={2} w={6} h={6} 
                onClick={() => {
                  onCopyAddress();
                  showToast();
                }}
            />
            <Link target='_blank' href={`https://mempool.space/address/${row.original.address}`}>
              <IconButton 
                aria-label='Open address in mempool.space' 
                icon={<MdLink />}  
                variant='outline'
                ml={2} w={6} h={6} 
                onClick={() => {
                  onCopyAddress();
                  showToast();
                }}
              />
            </Link>
          </Flex>
        )
      }
    },
  ];


  return (
    <Box my={2} width={{base: '100%', md: '100%'}}>
      <Flex flexDirection='column' gap='20px'>
        {
          detailRows.map((row: DetailRow) => <DetailRow key={row.key} row={row} />)
        }
      </Flex>
    </Box>
  );
}

function DetailRow(props: {row: DetailRow}) {
  const row: DetailRow = props.row;

  return (
    <Flex flexDirection={{base: 'column', lg: 'row'}}>
      <Box mb={2} flex={1}>
        <b> {row.left.title} </b>
        {row.left.value}
      </Box>
      <Box mb={2} flex={1}>
        <b> {row.right.title} </b>
        {row.right.value}
      </Box>
    </Flex>
  );
}
