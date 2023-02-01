import { useState } from "react";

import { Button, chakra, Flex, FormLabel, IconButton, Input, InputGroup, Skeleton, Text, useClipboard, useToast } from "@chakra-ui/react";

import { withErrorBoundary } from "react-error-boundary";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdContentCopy } from "react-icons/md";
import QRCode from "react-qr-code";

import { Widget } from "..";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";

type Inputs = {
    label: string,
};

const WasabiReceiveWidget = () => {
  console.log('Render: Wasabi Receive Widget');

  const [ address, setAddress ] = useState('bc1qxj93vd2n3nkycne4c4hmydzfqr4p2tznqka2uz');
  const [loading, setLoading] = useState<boolean>(false);
  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, reset } = formVars;
  const { onCopy: onCopyAddress } = useClipboard(address);

  const toast = useToast();

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
                value={address}
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