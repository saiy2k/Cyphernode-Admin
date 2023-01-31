'use client';

import {
  Button,
  chakra,
  Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
  Text,
  useToast,
} from '@chakra-ui/react';
import { LoaderOverlay, Widget } from '@shared/components';
import { postCallProxy } from '@shared/services/api';
import { OTS_StampPayload } from '@shared/types';
import { useState } from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';

type Inputs = {
  hash: string,
  callbackURL: string,
};

function Stamp() {
  console.log('Stamp :: render');
  const [ loading, setLoading ] = useState<boolean>(false);

  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, reset, control } = formVars;

  const toast = useToast();
  const handleError = useErrorHandler();


  const stamp = async (payload: OTS_StampPayload) => {
    setLoading(true);
    const endpoint = 'ots_stamp';
    try {
      const serverResp = await postCallProxy(endpoint, payload);
      console.log('serverResp', serverResp);

      if(serverResp.status === 401) {
        throw new Error('401 Authorization Required');
      }

      if (!serverResp.ok) {
        let errorString = serverResp.status + ': ' + serverResp.statusText;
        if (serverResp.body) {
          console.log('serverRes.body: ', serverResp.body);
          const serverError = await serverResp.json();
          errorString = errorString + ': ' + (serverError.message ? serverError.message : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      // const response = await serverResp.json();
      reset();
      toast({
        title: 'Stamped',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch(err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    console.log('Stamp :: onSubmit');

    const payload: OTS_StampPayload = {
      ...data,
    };

    stamp(payload);
  }

  const onError = (errors: any, e: any) => {
    console.log('Stamp :: onErorr');
    console.log(errors, e);
  }

  return (
    <Widget variant="border" position='relative'>
      <Text as='h3' marginBottom={15}> Stamp </Text>
      <chakra.form display='flex' flexDirection='column' gap='20px' mt={5} onSubmit={handleSubmit(onSubmit, onError)}>
          <FormControl isInvalid={errors.hasOwnProperty('hash')}>
            <FormLabel>Hash</FormLabel>
            <InputGroup flexDirection='column' gap='5px'>
                <Input
                  type='text'
                  placeholder='Enter a hash'
                  {...register('hash', {required: true})}
                />

                <div>
                {
                  errors.hash?.type === 'required'
                  ? <FormErrorMessage>Hash is mandatory</FormErrorMessage>
                  : null
                }
                </div>
            </InputGroup>
          </FormControl>

          <FormControl isInvalid={errors.hasOwnProperty('callbackURL')}>
            <FormLabel>Callback URL</FormLabel>
            <InputGroup flexDirection='column' gap='5px'>
            <Input
              type='text'
              placeholder="https://example.com/callback1conf"
              {...register('callbackURL', {required: true, pattern: {value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, message: 'Should be a valid URL'}})}
            />

                <div>
                {
                  errors.callbackURL?.type === 'required'
                  ? <FormErrorMessage>Callback URL is mandatory</FormErrorMessage>
                  : null
                }

                {
                  errors.callbackURL?.message
                  ? <FormErrorMessage>{errors.callbackURL?.message}</FormErrorMessage>
                  : null
                }
                </div>
            </InputGroup>
          </FormControl>

          <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Stamp </Button>

      </chakra.form>

      {loading ? <LoaderOverlay> Stamping... </LoaderOverlay>: null }
    </Widget>
  )
}


const StampWithErrorBoundary = withErrorBoundary(Stamp, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Stamp' />)
});

export default StampWithErrorBoundary;