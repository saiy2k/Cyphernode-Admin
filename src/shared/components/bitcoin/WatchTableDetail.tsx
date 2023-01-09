import React, { PropsWithChildren } from 'react';

import {
  Box,
  Button,
  Flex,
  Link,
  IconButton,
  Text,
  useToast,
  useClipboard,
} from '@chakra-ui/react';

import dayjs from 'dayjs';
import { MdContentCopy } from 'react-icons/md';
import { MdLink } from 'react-icons/md';
import { DetailRow, Watch } from '@shared/types';
import { textStyles } from '@theme/customStyles';
import { Row } from '@tanstack/react-table';

type WatchDetailProps = PropsWithChildren & { row: Row<Watch>
};

export const WatchDetail = ({row}: WatchDetailProps) => {

  const { onCopy: onCopyAddress } = useClipboard(row.original.address);
  const { onCopy: onCopyTxid } = useClipboard(row.original.address);
  const toast = useToast();

  const showToast = () => {
    toast({
      title: 'Copied...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const detailRows: any[] = [
    {
      key: 1,
      title: 'Address',
      value: <Text {...textStyles.body}>{row.original.address}</Text>
    }, {
      key: 2,
      title: 'Label',
      value: <Text {...textStyles.body}>{row.original.label}</Text>
    }, {
      key: 3,
      title: 'Confirmed callback',
      value: <Text {...textStyles.body}>{row.original.confirmedCallbackURL}</Text>
    }, {
      key: 4,
      title: 'Unconfirmed callback',
      value: <Text {...textStyles.body}>{row.original.unconfirmedCallbackURL}</Text>
    },
  ];


  return (
    <Flex flexDirection='column' gap='20px' my={2}>
      {
        detailRows.map((row: DetailRow) => <DetailRow key={row.key} row={row} />)
      }
      <Flex gap='10px' alignSelf='end'>
        <Button width={{base: '45%', sm: 120}} h={12} onClick={() => console.log('button clicked') }> Edit </Button>
        <Button width={{base: '45%', sm: 120}} h={12} onClick={() => console.log('button clicked') }> Unwatch </Button>
      </Flex>
    </Flex>
  );
}


type DetailRowProps = PropsWithChildren & {
  row: any
};

function DetailRow(props: DetailRowProps) {
  const row: any = props.row;

  return (
    <Box mb={2} flex={1}>
      <b> {row.title} </b>
      {row.value}
    </Box>
  );
}
