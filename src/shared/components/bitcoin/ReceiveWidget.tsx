import { useEffect, useState } from 'react';

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
  Widget,
} from '@shared/components/index';
import { getCall } from '@shared/services/api';
import { ADDRESS_TYPES } from '@shared/constants';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';

const BitcoinReceiveWidget = () => {

  console.log('Render: Bitcoin Receive Widget');

  const [aType, setAType] = useState<string>(ADDRESS_TYPES[0].id);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const {onCopy, setValue: setClipboardValue } = useClipboard("");

  const handleError = useErrorHandler();

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
      setClipboardValue(response.address);
    } catch (err: unknown) {
      handleError(err);
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
            <SkeletonText isLoaded={!loading}>
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
                <Text fontSize='md' mt={2}>({ aType })</Text>
              </Text>: null }
            </SkeletonText>
          </Box>
        </Box>
      </Flex>

    </Widget>
  )
}


const BitcoinReceiveWidgetWithErrorBoundary = withErrorBoundary(BitcoinReceiveWidget, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Receive widget' />)
});

export default BitcoinReceiveWidgetWithErrorBoundary;
