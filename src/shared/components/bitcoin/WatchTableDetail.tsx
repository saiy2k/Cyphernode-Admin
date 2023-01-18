import React, { PropsWithChildren, useState } from 'react';

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
import { Watch } from '@shared/types';
import { textStyles } from '@theme/customStyles';
import { Row } from '@tanstack/react-table';
import { LoaderOverlay } from '..';
import ConfirmationDialog from '@shared/ConfirmationModal';
import DetailRow, { DetailRowData } from '../ClientDataTable/DetailRow';

type WatchDetailProps = PropsWithChildren & {
  row: Row<Watch>,
  isUpdating: boolean,
  isUnWatching: boolean,
  type: ("address" | "xpub"),
  onEdit?: (watchObject: Watch) => void,
  onUnWatch?: (watchObject: Watch) => void,
};

export const WatchDetail = ({
  row,
  onEdit,
  onUnWatch,
  isUpdating,
  isUnWatching,
  type,
}: WatchDetailProps) => {

  const { onCopy: onCopyAddress } = useClipboard(row.original.address);
  const { onCopy: onCopyTxid } = useClipboard(row.original.address);

  const [ editMode, setEditMode ] = useState(false);

  const [ data, setData ] = useState<Watch>(row.original);

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
      _key: 'address',
      title: 'Address',
      textComponent: <Text {...textStyles.body}>{type === "address" ? data.address: data.pub32}</Text>,
      value: data.pub32,
      type: 'text',
      nonEditable: true,
    }, {
      _key: 'label',
      title: 'Label',
      textComponent: <Text {...textStyles.body}>{data.label}</Text>,
      value: data.label,
      type: 'text',
    }, {
      _key: 'confirmedCallbackURL',
      title: 'Confirmed callback',
      textComponent: <Text {...textStyles.body}>{data.confirmedCallbackURL}</Text>,
      value: data.confirmedCallbackURL,
      type: 'text',
    }, {
      _key: 'unconfirmedCallbackURL',
      title: 'Unconfirmed callback',
      textComponent: <Text {...textStyles.body}>{data.unconfirmedCallbackURL}</Text>,
      value: data.unconfirmedCallbackURL,
      type: 'text',
    }
  ];

  if(type === "xpub") {
    const derivationPathRow = {
      _key: 'derivation_path',
      title: 'Path',
      textComponent: <Text {...textStyles.body}>{data.derivation_path}</Text>,
      value: data.derivation_path,
      type: 'text',
    };

    detailRows.splice(2, 0, derivationPathRow);
  }

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
    <Flex flexDirection='column' gap='20px' my={2}>
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
      <Flex gap='10px' alignSelf='end'>
        {
          onEdit
          ? editMode
            ? <Button width={{base: '45%', sm: 120}} h={12} onClick={() => saveChanges() }> Save Changes </Button>
            : <Button width={{base: '45%', sm: 120}} h={12} onClick={() => setEditMode(true) }> Edit </Button>
          : null
        }
        
        {
          onUnWatch
          ? (
              <ConfirmationDialog
                deleteTrigger={(props: any) => <Button {...props} width={{base: '45%', sm: 120}} h={12}> Unwatch </Button>}
                onDialogClose={(confirm: boolean) => {
                  if(confirm) {
                    onUnWatch(data)
                  }
                }}
                title="Unwatch confirmation"
                message="Are you sure, you want to unwatch this address?"
              />
            )
          : null
        }
      </Flex>
      {isUpdating ? <LoaderOverlay> Updating... </LoaderOverlay>: null }
      {isUnWatching ? <LoaderOverlay> Unwatching... </LoaderOverlay>: null }
    </Flex>
  );
}
