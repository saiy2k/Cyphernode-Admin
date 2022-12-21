import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/react'
import { MdContentCopy } from 'react-icons/md';
import QRCode from "react-qr-code";

import { 
  ButtonGroup,
  Widget, 
  LoaderOverlay, 
  ErrorOverlay,
} from '@shared/components/index';
import { getCall } from '@shared/services/api';
import { ADDRESS_TYPES } from '@shared/constants';

export const BitcoinReceiveWidget = () => {

  const [aType, setAType] = useState(ADDRESS_TYPES[0].id);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {onCopy, setValue} = useClipboard("");

  const toast = useToast();

  const generateAddress = async (addType: string) => {
    setAType(addType);
    setLoading(true);
    try {
      const serverResp = await getCall(`getnewaddress/${addType}`, 2);
      if (!serverResp.ok) {
        throw new Error(serverResp.status + ': ' + serverResp.statusText);
      }
      const response = await serverResp.json();
      setAddress(response.address);
      setValue(response.address);
    } catch (err: unknown) {
      if (typeof err === 'string') {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generateAddress(aType);
  }, [aType]);

  const onClipboardCopy = () => {
    onCopy();
    toast({
      title: 'Copied...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Widget variant='border' style={{ position: 'relative' }}>
      <Flex flexDirection={{base: 'column-reverse', md: 'row'}} alignItems={{base: 'center', md: 'flex-start'}} gap={{base: '50px', md: '0'}}>
        
        <QRCode
          style={{ height: "auto", width: '256px', }}
          value={address}
          viewBox={`0 0 256 256`}
        />

        <Box ml={4}>

          <ButtonGroup
            name='address-type'
            defaultValue={ADDRESS_TYPES[0].id}
            value={aType}
            onChange={(value: string) => {setAType(value)}}
            options={ADDRESS_TYPES}
            key='address-type'
          />

          <Box mt={4}>
            { address.length > 0 ?
            <Text fontSize='lg'>
              { address }
              <IconButton 
                aria-label='Copy address' 
                icon={<MdContentCopy />}  
                variant='outline'
                ml={2} w={8} h={8} 
                onClick={onClipboardCopy}
              />
              <br/>
              <Text fontSize='md' mt={2}>({ aType })</Text>
            </Text>: null }
          </Box>
        </Box>
      </Flex>

      {loading ? <LoaderOverlay> Fetching... </LoaderOverlay>: null }

      {error ? <ErrorOverlay onReset={ () => setError(null)}> { error } </ErrorOverlay>: null }

    </Widget>
  )
}

