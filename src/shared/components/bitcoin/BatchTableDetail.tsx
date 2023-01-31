import React, { PropsWithChildren, useState } from 'react';

import { default as NLink } from 'next/link';

import {
  Box,
  Button,
  Flex,
  Link,
  IconButton,
  Text,
  useToast,
  useClipboard,
  Input,
  Select,
} from '@chakra-ui/react';

import dayjs from 'dayjs';
import { MdContentCopy } from 'react-icons/md';
import { MdLink } from 'react-icons/md';
import { Batch } from '@shared/types';
import { textStyles } from '@theme/customStyles';
import { Row } from '@tanstack/react-table';
import { LoaderOverlay } from '..';
import ConfirmationDialog from '@shared/ConfirmationModal';
import DetailRow, { DetailRowData } from '../ClientDataTable/DetailRow';

type BatchDetailProps = PropsWithChildren & {
  row: Row<Batch>,
  isUpdating: boolean,
  onEdit?: (batchObject: Batch) => void,
};

export const BatchDetail = ({
  row,
  onEdit,
  isUpdating,
}: BatchDetailProps) => {

  const [ editMode, setEditMode ] = useState(false);

  const [ data, setData ] = useState<Batch>(row.original);

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
      _key: 'batcherLabel',
      title: 'Label',
      textComponent: (props) => <Text {...textStyles.body}>{data.batcherLabel}</Text>,
      value: data.batcherLabel,
      type: 'text',
    },
    {
      _key: 'confTarget',
      title: 'Target',
      textComponent: (props) => <Text {...textStyles.body}>{data.confTarget}</Text>,
      value: data.confTarget,
      type: 'text',
    },
    {
      _key: 'txnCount',
      title: 'Txn Count',
      textComponent: (props) => <Text {...textStyles.body}>{data.nbOutputs}</Text>,
      value: data.confTarget,
      type: 'text',
      nonEditable: true,
    },
    {
      _key: 'amount',
      title: 'Amount',
      textComponent: (props) => <Text {...textStyles.body}>{data.total}</Text>,
      value: data.confTarget,
      type: 'text',
      nonEditable: true,
    },
  ];

  const saveChanges = () => {
    setEditMode(false);

    if(onEdit) {
      onEdit(data);
    }
  }

  const onValueChange = (_key: string, value: any) => {
    setData({
      ...data,
      [_key]: value,
    });
  }

  return (
    <Flex flexDirection='column' gap='20px' my={2} width={{base: 'calc(100vw - 80px)', lg: 'auto'}}>
      <Flex flexDirection={{base: 'column', md: 'row'}} justifyContent='space-between' alignItems={{base: 'flex-start', md: 'center'}} gap='20px' my={2}>
        {
          detailRows.map((row: DetailRowData) => (
            <DetailRow
              key={row._key}
              _key={row._key}
              title={row.title}
              value={row.value}
              textComponent={row.textComponent}
              type={row.type}
              options={row.options}
              nonEditable={row.nonEditable}
              editMode={editMode}
              onChange={onValueChange}
            />
          ))
        }
      </Flex>

      <Flex gap='10px' alignSelf={{base: 'start', xl: 'end'}}>
        {
          onEdit
          ? editMode
            ? (
                <>
                  <Button width={{base: '45%', sm: 120}} h={12} onClick={() => saveChanges() }> Save Changes </Button>
                  <Button width={{base: '45%', sm: 120}} h={12} onClick={() => setEditMode(false) }> Cancel </Button>
                </>
              )
            : <Button width={{base: 'auto', sm: 120}} h={12} onClick={() => setEditMode(true) }> Edit </Button>
          : null
        }

        <NLink href={`/bitcoin/batches/${row.original.batcherId}`}>
          <Button width={{base: 'auto', sm: 120}} h={12}> Full detail </Button>
        </NLink>
      </Flex>
      {isUpdating ? <LoaderOverlay> Updating... </LoaderOverlay>: null }
    </Flex>
  );
}