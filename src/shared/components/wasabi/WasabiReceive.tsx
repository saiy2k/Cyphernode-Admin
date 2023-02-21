import { useState } from "react";

import { Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, Select, Skeleton, Text, useClipboard, useToast } from "@chakra-ui/react";

import { useErrorHandler, withErrorBoundary } from "react-error-boundary";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdContentCopy } from "react-icons/md";
import QRCode from "react-qr-code";

import { Widget } from "..";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";
import { WasabiGetAddressPayload } from "@shared/types";
import { postCallProxy } from "@shared/services/api";

type Inputs = {
    label: string,
    instanceId: number,
};

const WasabiReceiveWidget = () => {
  console.log('Render: Wasabi Receive Widget');

  const [ address, setAddress ] = useState('bc1qxj93vd2n3nkycne4c4hmydzfqr4p2tznqka2uz');
  const [loading, setLoading] = useState<boolean>(false);
  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, reset } = formVars;
  const { onCopy: onCopyAddress, setValue: setCLipboardValue } = useClipboard(address);

  const toast = useToast();

  const handleError = useErrorHandler();

  const showToast = () => {
    toast({
      title: 'Copied...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('Render: Wasabi Receive Widget :: onSubmit');
    const payload: WasabiGetAddressPayload = {
      ...data,
      instanceId: Number(data.instanceId),
    }

    getAddress(payload);
  }

  async function getAddress(payload: WasabiGetAddressPayload) {
    setLoading(true);
    try {
      const serverResp = await postCallProxy('wasabi_getnewaddress', payload);
      console.log(serverResp);
      if (!serverResp.ok) {
        let errorString = serverResp.status + ': ' + serverResp.statusText;
        if (serverResp.body) {
          try {
            const serverError = await serverResp.json();
            errorString = errorString + ': ' + (serverError.message ? serverError.message : JSON.stringify(serverError));
          } catch(err) {
            console.log(err);
          }
        }
        throw new Error(errorString);
      }
      const response = await serverResp.json();
      if (response.error) {
        throw new Error(JSON.stringify(response.error));
      } else {
        setAddress(response.address);
        setCLipboardValue(response.address);
      }
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  const onError = () => {
    console.log('Render: Wasabi Receive Widget :: onError');
      
  }

  return (
      <Widget variant='border' style={{ position: 'relative' }}>
          <Flex justifyContent='space-between' gap={{base: '50px', md: 5}} flexDirection={{base: 'column-reverse', md: 'row'}} alignItems={{base: 'center', md: 'initial'}}>
              <Flex flexDirection='column' justifyContent='space-between' width='100%' gap={5}>
                  <chakra.form display='flex' flexDirection='column' onSubmit={handleSubmit(onSubmit, onError)}>
                    <InputGroup flexDirection={{base: 'column'}} maxHeight={{base: '200px', md: 'auto'}}>
                      <FormLabel>Label</FormLabel>
                      <Input type='text' {...register('label', { required: true}) } />
                    </InputGroup>

                    { /* Instance field */ }
                    <FormControl isInvalid={errors.hasOwnProperty('instanceId')}>
                      <FormLabel>Instance</FormLabel>
                      <InputGroup flexDirection='column' gap='5px'>
                        <Select {...register('instanceId', {required: true})} placeholder="Select an instance">
                          <option value={0}>Instance 0</option>
                          <option value={1}>Instance 1</option>
                        </Select>
                      </InputGroup>

                      { errors.instanceId?.type === 'required' ? 
                      <FormErrorMessage> Instance is required </FormErrorMessage>: null }
                    </FormControl>

                    <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Generate </Button>
                  </chakra.form>
                  <Flex alignSelf={{base: 'flex-start', md: 'flex-end'}} alignItems='center' width={{base: '100%', md: 'auto'}}>
                    <Text overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>{address}</Text>
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
                  </Flex>
              </Flex>

            <Skeleton height="100%" width="256px" isLoaded={!loading}>
              <QRCode
                style={{ height: "auto", width: '100%', }}
                value={address || ''}
                viewBox={`0 0 256 256`}
              />
            </Skeleton>
          </Flex>
      </Widget>
  );
}

const WasabiReceiveWidgetWithErrorBoundary = withErrorBoundary(WasabiReceiveWidget, {
    fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Receive widget' />)
  });
  
export default WasabiReceiveWidgetWithErrorBoundary;  