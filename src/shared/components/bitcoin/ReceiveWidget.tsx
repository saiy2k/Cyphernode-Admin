import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  SkeletonText,
  Text,
  useToast,
  useClipboard,
} from '@chakra-ui/react';

import { MdContentCopy } from 'react-icons/md';
import QRCode from "react-qr-code";
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { 
  ButtonGroup,
  ErrorOverlay,
  Widget,
} from '@shared/components/index';
import { getCallProxy } from '@shared/services/api';
import { ADDRESS_TYPES } from '@shared/constants';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';

const BitcoinReceiveWidget = () => {

  console.log('Render: Bitcoin Receive Widget');

  const [aType, setAType] = useState<string>(ADDRESS_TYPES[0].id);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const {onCopy, setValue: setClipboardValue } = useClipboard("");
  const [error, setError] = useState<string | null>(null);

  const handleError = useErrorHandler();

  const toast = useToast();

  const generateAddress = useCallback(async () => {
    console.log('Receive Widget :: generateAddress');
    // setAType(addType);
    setLoading(true);
    try {
      const serverResp = await getCallProxy(`getnewaddress/${aType}`);
      if (!serverResp.ok) {
        throw new Error(serverResp.status + ': ' + serverResp.statusText);
      }
      const response = await serverResp.json();
      setAddress(response.address);
      setClipboardValue(response.address);
    } catch (err: unknown) {
      // handleError(err);
      if (typeof err === 'string') {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [aType, handleError, setClipboardValue]);

  useEffect(() => {
    console.log('Receive Widget :: useEffect');
    generateAddress();
  }, [generateAddress]);

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
        
        <Skeleton height="100%" width="256px" isLoaded={!loading}>
          <QRCode
            style={{ height: "auto", width: '100%', }}
            value={address}
            viewBox={`0 0 256 256`}
          />
        </Skeleton>

        <Box ml={{ base: 0, md: 4 }} width='100%'>

          <ButtonGroup
            name='address-type'
            defaultValue={ADDRESS_TYPES[0].id}
            value={aType}
            onChange={(value: string) => {setAType(value)}}
            options={ADDRESS_TYPES}
            key='address-type'
          />

          <Box mt={4}>
            <SkeletonText isLoaded={!loading} noOfLines={2} skeletonHeight={6} spacing={3} as='div'>
              { address.length > 0 ?
              <Text fontSize='lg' lineHeight={{base: '1.5rem'}}>
                { address }
                <IconButton 
                  aria-label='Copy address' 
                  icon={<MdContentCopy />}  
                  variant='outline'
                  ml={2} w={8} h={8} 
                  onClick={onClipboardCopy}
                />
                <br/>
                <Text fontSize='md' mt={2} as='span'>({ aType })</Text>
              </Text>: null }
            </SkeletonText>
          </Box>
        </Box>
      </Flex>

      {error ? <ErrorOverlay onReset={ () => setError(null)}> { error } </ErrorOverlay>: null }
    </Widget>
  )
}

const BitcoinReceiveWidgetWithErrorBoundary = withErrorBoundary(BitcoinReceiveWidget, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Receive widget' />)
});

export default BitcoinReceiveWidgetWithErrorBoundary;
