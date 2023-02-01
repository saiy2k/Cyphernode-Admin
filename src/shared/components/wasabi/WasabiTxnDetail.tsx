import React, { PropsWithChildren } from 'react';

import {
  Box,
  Flex,
  Link,
  IconButton,
  Text,
  useToast,
  useClipboard,
} from '@chakra-ui/react';

import { MdLink, MdContentCopy } from 'react-icons/md';
import { Row } from '@tanstack/react-table';

import { DetailRow, Wasabi } from '@shared/types';
import { textStyles } from '@theme/customStyles';

type WasabiTxnDetailProps = PropsWithChildren & {
  row: Row<Wasabi>
};

const textOverflowStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

export const WasabiTxnDetail = ({row}: WasabiTxnDetailProps) => {

  console.log("WasabiTxnDetail :: Render")

  const { onCopy: onCopyInputAddress } = useClipboard(row.original.inputAddress);
  const { onCopy: onCopyOutputAddress } = useClipboard(row.original.outputAddress);
  const { onCopy: onCopyTxid } = useClipboard(row.original.txnId);
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
        title: 'Confirmations',
        value: <Text {...textStyles.body}>{row.original.confirmations}</Text>
      },
      right: {
        title: 'Confirmed Block',
        value: <Text {...textStyles.body}>{row.original.confirmedBlock}</Text>
      }
    },
    {
      key: 2,
      left: {
        title: 'Input',
        value: (
          <Flex alignItems='center'>
            <Text {...textOverflowStyle} {...textStyles.body}>{row.original.inputAddress}</Text>
            <IconButton 
                aria-label='Copy address' 
                icon={<MdContentCopy />}  
                variant='outline'
                ml={2} w={6} h={6} 
                onClick={() => {
                  onCopyInputAddress();
                  showToast();
                }}
            />
            <Link target='_blank' href={`https://mempool.space/address/${row.original.inputAddress}`}>
              <IconButton 
                aria-label='Open address in mempool.space' 
                icon={<MdLink />}  
                variant='outline'
                ml={2} w={6} h={6} 
                onClick={() => {
                  showToast();
                }}
              />
            </Link>
          </Flex>
        )
      },
      right: {
        title: 'Output',
        value: (
          <Flex alignItems='center'>
            <Text {...textOverflowStyle} {...textStyles.body}>{row.original.outputAddress}</Text>
            <IconButton 
                aria-label='Copy address' 
                icon={<MdContentCopy />}  
                variant='outline'
                ml={2} w={6} h={6} 
                onClick={() => {
                  onCopyOutputAddress();
                  showToast();
                }}
            />
            <Link target='_blank' href={`https://mempool.space/address/${row.original.outputAddress}`}>
              <IconButton 
                aria-label='Open address in mempool.space' 
                icon={<MdLink />}  
                variant='outline'
                ml={2} w={6} h={6} 
                onClick={() => {
                  showToast();
                }}
              />
            </Link>
          </Flex>
        )
      }
    }
  ];


  return (
    <Box my={2} width={{base: '100%', md: '100%'}}>
      <Flex flexDirection='column' gap={{base: 'none', md: '20px'}}>
        {
          detailRows.map((row: DetailRow) => <DetailRow key={row.key} row={row} />)
        }
      </Flex>
    </Box>
  );
}


type DetailRowProps = PropsWithChildren & {
  row: DetailRow
};

function DetailRow(props: DetailRowProps) {
  const row: DetailRow = props.row;

  return (
    <Flex flexDirection={{base: 'column', lg: 'row'}}>
      <Box mb={2} flex={1}>
        <b> {row.left.title} </b>
        <Box
          whiteSpace='nowrap'
          overflow='hidden'
          maxWidth={{
            base: 'calc(100vw - 85px);', // 85px = ((20px [padding] + 20px [padding]) * 2) + 5px [extra space]
            lg: '500px'
          }}
          textOverflow='ellipsis'
        >
        {row.left.value}
      </Box>
      </Box>
      <Box mb={2} flex={1}>
        <b> {row.right.title} </b>
        <Box
          whiteSpace='nowrap'
          overflow='hidden'
          maxWidth={{
            base: 'calc(100vw - 85px);', // 85px = ((20px [padding] + 20px [padding]) * 2) + 5px [extra space]
            md: '500px'
          }}
          textOverflow='ellipsis'
        >
        {row.right.value}
        </Box>
      </Box>
    </Flex>
  );
}
