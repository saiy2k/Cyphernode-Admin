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

type DetailRowData = {
  _key: string,
  title: string,
  value: any,
  textComponent: JSX.Element,
  type: React.HTMLInputTypeAttribute | "select",
  options?: DropDownOption[],
  nonEditable?: boolean,
}

type DetailRowProps = DetailRowData & {
  editMode?: boolean,
  onChange: (key: string, value: any) => void,
};

function DetailRow({
  _key,
  title,
  value,
  type,
  textComponent,
  editMode,
  onChange,
  options,
  nonEditable,
}: DetailRowProps) {

  const onValueChange = (value: any) => {
    onChange(_key, value)
  };

  return (
    <Box mb={2} flex={1}>
      {
        editMode && !nonEditable
        ? <DetailRowInput type={type} value={value} onChange={onValueChange} options={options} />
        : (
            <>
              <b> {title} </b>
              <Text whiteSpace={{base: 'nowrap', md: 'normal'}} overflow={{base: 'hidden', md: 'unset'}} maxWidth={{base: '150px', md: '500px'}} textOverflow='ellipsis' {...textStyles.body}>{textComponent}</Text>
            </>
          )
      }
    </Box>
  );
}

type DropDownOption = {
  id: any,
  value: any,
};

type DetailRowInputProps = PropsWithChildren & {
  type: React.HTMLInputTypeAttribute,
  options?: DropDownOption[],
  onChange: (value: any) => void,
  value: any,
};

function DetailRowInput({
  type,
  options = [],
  onChange = () => {},
  value,
}: DetailRowInputProps) {

  if(type === "select") {
    return (
      <Select onChange={(e) => onChange(e.target.value)} value={value}>
        {
          options.map(option => (<option key={option.id} value={option.id}>{option.value}</option>))
        }
      </Select>
    );
  } else {
    return (
      <Input type={type} onChange={(e) => onChange(e.target.value)} value={value} />
    );
  }
}