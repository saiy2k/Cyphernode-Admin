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


  return (
    <Box my={2} width={{base: '100%', md: '100%'}}>
      <Flex direction='row' w='100%' justifyContent='space-between' mb={2}>
        <span> Amount </span>
        <b> { row.original.amount } </b>

        <span> &nbsp; </span>
        <span> &nbsp; </span>
        <span> &nbsp; </span>

        <span> Confirmations </span>
        <b> { row.original.confirmations } </b>

        <span> &nbsp; </span>
        <span> &nbsp; </span>
        <span> &nbsp; </span>

        <span> Confirmed block </span>
        <b> { row.original.confirmations } </b>
      </Flex>

      <Box mb={2}>
        <b> First seen time </b>
        <Text>
          { dayjs(row.original.time * 1000).format("DD-MMM-YYYY hh:mm:ss A") }
        </Text>
      </Box>

      <Box mb={2}>
        <b> Date </b>
        <Text>
          { dayjs(row.original.timereceived * 1000).format("DD-MMM-YYYY hh:mm:ss A") }
        </Text>
      </Box>

      <Box mb={2}>
        <b> Transaction ID </b>
        <Text>
          { row.original.txid }
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
        </Text>
      </Box>


      <Box mb={2}>
        <b> Address </b>
        <Text>
          { row.original.address }
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
          <Link href={`https://mempool.space/address/${row.original.address}`}>
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
        </Text>
      </Box>

      <Box>
        <b> Tx id </b>
        <Text>
          { row.original.txid }
          <IconButton 
            aria-label='Copy Tx id' 
            icon={<MdContentCopy />}  
            variant='outline'
            ml={2} w={6} h={6} 
          />
          <Link href={`https://mempool.space/tx/${row.original.txid}`}>
            <IconButton 
              aria-label='Open tx in mempool.space' 
              icon={<MdLink />}  
              variant='outline'
              ml={2} w={6} h={6} 
            />
          </Link>
        </Text>
      </Box>

    </Box>
  );
}
