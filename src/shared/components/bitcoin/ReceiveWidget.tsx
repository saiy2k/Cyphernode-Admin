import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/react'
import { MdContentCopy } from 'react-icons/md';
import QRCode from "react-qr-code";

import { Widget, LoaderOverlay, ErrorOverlay } from '@shared/components/index';
import { getCall } from '@shared/services/api';

export const BitcoinReceiveWidget = () => {

  const [aType, setAType] = useState('');
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { onCopy, setValue } = useClipboard("");

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
      <Flex>
        { /*
        <Image 
          boxSize='256px'
          borderRadius='12px'
          width='256px'
          src="/qrcode.png" />
        */ }
        <QRCode
          style={{ height: "auto", width: '256px', }}
          value={address}
          viewBox={`0 0 256 256`}
        />

        <Box ml={4}>
          <Flex gap={4}>
            <Button variant='outline' onClick={() => generateAddress('legacy')}> legacy </Button>
            <Button variant='outline' onClick={() => generateAddress('bech32')}> bech32 </Button>
            <Button variant='outline' onClick={() => generateAddress('p2sh-segwit')}> p2sh-segwit </Button>
            <Button variant='outline' onClick={() => generateAddress('taproot')}> taproot </Button>
          </Flex>

          <Box mt={4}>
            { address.length > 0 ?
            <Text fontSize='xl'>
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

